use solana_program::{
  account_info::{next_account_info, AccountInfo}, entrypoint::ProgramResult, program::{invoke, invoke_signed}, program_error::ProgramError, pubkey::Pubkey, system_instruction, sysvar::{clock::Clock, rent::Rent, Sysvar}
};
use borsh::BorshSerialize;
use crate::state::{Bid, GameState, PlayerState, BID_ACCOUNT_SIZE, PLAYER_ACCOUNT_SIZE};
use crate::error::BiddingError;
use crate::utils::{
  player_pda_seeds, 
  bid_pda_seeds, find_account, 
  fetch_bid_history, 
  transfer_from_pda, 
  deserialize_game_state,
  deserialize_player_state
};

pub fn place_bid(
  program_id: &Pubkey,
  accounts: &[AccountInfo],
  bid_amount: u64,
  bid_count: u64,
) -> ProgramResult {
  let accounts_iter = &mut accounts.iter();
  let system_program = next_account_info(accounts_iter)?;
  let _platform_account = next_account_info(accounts_iter)?;
  let game_account = next_account_info(accounts_iter)?;
  let bidder_account = next_account_info(accounts_iter)?;
  let new_bid_account = next_account_info(accounts_iter)?;
  let new_player_account = next_account_info(accounts_iter)?;

  if game_account.data_len() != std::mem::size_of::<GameState>() {
    return Err(ProgramError::InvalidAccountData.into());
  }

  let mut game_state = deserialize_game_state(&game_account.data.borrow())?;

  if game_state.game_ended {
    return Err(BiddingError::GameEnded.into());
  }

  let current_time = Clock::get()?.unix_timestamp as u64;

  if current_time - game_state.last_bid_time > 600 {
    return end_game(program_id, game_state.game_id, accounts, &mut game_state);
  }

  if bid_amount < 2 * game_state.highest_bid {
    return Err(BiddingError::InsufficientBidAmount.into());
  }

  let new_bid_count = game_state.total_bids + 1;

  if bid_count != new_bid_count {
    return Err(BiddingError::BidCountMismatch.into());
  } 

  let (new_player_pda, new_player_bump) = player_pda_seeds(
    game_state.game_id, 
    bidder_account.key, 
    new_bid_count, 
    program_id
  );

  if *new_player_account.key != new_player_pda {
    return Err(BiddingError::InvalidNewPlayerAccount.into());
  }

  let (new_bid_pda, new_bid_bump) = bid_pda_seeds(
    game_state.game_id, 
    new_bid_count, 
    program_id
  );
  
  if *new_bid_account.key != new_bid_pda {
    return Err(BiddingError::InvalidNewBidAccount.into());
  }

  let rent = Rent::get()?;
  let player_rent = rent.minimum_balance(std::mem::size_of::<PlayerState>());
  let bid_rent = rent.minimum_balance(std::mem::size_of::<Bid>());

  invoke_signed(
    &system_instruction::create_account(
      bidder_account.key,
      new_player_account.key,
      player_rent,
      PLAYER_ACCOUNT_SIZE as u64,
      program_id,
    ),
    &[bidder_account.clone(), new_player_account.clone(), system_program.clone()],
    &[&[
      b"player", 
      &game_state.game_id.to_le_bytes(), 
      bidder_account.key.as_ref(), 
      &new_bid_count.to_le_bytes(), 
      &[new_player_bump]
    ]],
  )?;

  invoke_signed(
    &system_instruction::create_account(
      bidder_account.key,
      new_bid_account.key,
      bid_rent,
      BID_ACCOUNT_SIZE as u64,
      program_id,
    ),
    &[bidder_account.clone(), new_bid_account.clone(), system_program.clone()],
    &[&[
      b"bid", 
      &game_state.game_id.to_le_bytes(), 
      &new_bid_count.to_le_bytes(), 
      &[new_bid_bump]
    ]],
  )?;

  game_state.highest_bid = bid_amount;
  game_state.last_bid_time = current_time;
  game_state.last_bidder = *bidder_account.key;
  game_state.total_bids = new_bid_count;
  game_state.prize_pool += bid_amount;

  game_state.serialize(&mut &mut game_account.data.borrow_mut()[..])?;

  let new_player_state = PlayerState {
    total_bid_amount: bid_amount,
    safe: false,
    royalty_earned: 0,
    bid_count: new_bid_count,
  };

  new_player_state.serialize(&mut &mut new_player_account.data.borrow_mut()[..])?;
 
  let new_bid = Bid {
    bidder: *bidder_account.key,
    amount: bid_amount,
    timestamp: current_time,
  };

  new_bid.serialize(&mut &mut new_bid_account.data.borrow_mut()[..])?;

  invoke(
    &system_instruction::transfer(
      bidder_account.key,
      game_account.key,
      bid_amount,
    ),
    &[bidder_account.clone(), game_account.clone(), system_program.clone()],
  )?;

  Ok(())
}

pub fn end_game<'a, 'b: 'a>(
  program_id:  &Pubkey,
  game_id: u64,
  accounts: &'a [AccountInfo<'b>],
  game_state: &mut GameState,
) -> ProgramResult {
  let accounts_iter = &mut accounts.iter();
  let _system_program = next_account_info(accounts_iter)?;
  let platform_account = next_account_info(accounts_iter)?;
  let game_account = next_account_info(accounts_iter)?;

  let bid_history: Vec<Bid> = fetch_bid_history(program_id, game_state.game_id, game_state.total_bids, accounts)?;

  if bid_history.len() < 5 {
   
    let total_amount = game_state.prize_pool;
    let platform_fee = total_amount * 10 / 100;
    let remaining_prize = total_amount - platform_fee;

    let last_bid = bid_history.last().ok_or(BiddingError::NoBidsFound)?;
   
    let (winner_pda, _) = player_pda_seeds(
      game_state.game_id,
      &last_bid.bidder,  
      game_state.total_bids,
      program_id
    );
 
    let winner_account = find_account(&winner_pda, accounts)?;
 
    transfer_from_pda(game_account, platform_account, platform_fee)?;

    transfer_from_pda(game_account, winner_account, remaining_prize)?;
    
    let mut player_state =  deserialize_player_state(&winner_account.data.borrow())?;
    player_state.safe = true; 
    player_state.royalty_earned += remaining_prize; 
    player_state.serialize(&mut &mut winner_account.data.borrow_mut()[..])?;
 
    game_state.game_ended = true;
    game_state.serialize(&mut &mut game_account.data.borrow_mut()[..])?;
 
    return Ok(());
  }
 
  let last_5_bids: Vec<u64> = bid_history.iter().rev().take(5).map(|bid| bid.amount).collect();
  let platform_fee = last_5_bids.iter().sum::<u64>() * game_state.platform_fee_percentage / 100;

  let royalty_amount = bid_history[bid_history.len() - 4].amount;
 
  cal_royalties(&bid_history, royalty_amount, program_id, game_id, game_state.total_bids, game_account, accounts)?;
 
  let last_bid = bid_history.last().ok_or(BiddingError::NoWinnerFound)?;
 
  let (winner_pda, _) = player_pda_seeds(
    game_state.game_id,
    &last_bid.bidder,  
    game_state.total_bids,
    program_id
  );
 
  let winner_account = find_account(&winner_pda, accounts)?;
  

  transfer_from_pda(game_account, platform_account, platform_fee)?;

  let current_balance = **game_account.try_borrow_lamports()?;
  let rent = Rent::get()?;
  let rent_exempt_balance = rent.minimum_balance(game_account.data_len());
  let amount = current_balance.checked_sub(rent_exempt_balance)
    .ok_or(BiddingError::InsufficientFunds)?;

  transfer_from_pda(game_account, winner_account, amount)?;
 
  let mut player_state =  deserialize_player_state(&winner_account.data.borrow())?;
  player_state.safe = true; 
  player_state.royalty_earned += amount; 
  player_state.serialize(&mut &mut winner_account.data.borrow_mut()[..])?;
  
  game_state.game_ended = true;
  game_state.serialize(&mut &mut game_account.data.borrow_mut()[..])?;

  Ok(())
}

fn cal_royalties<'a, 'b: 'a>(
  bid_history: &[Bid],
  royalty_amount: u64,
  program_id: &Pubkey,
  game_id: u64,
  _total_bids: u64,
  game_account: &'a AccountInfo<'b>,
  accounts: &'a [AccountInfo<'b>],
) -> ProgramResult {
  let eligible_bidders = &bid_history[0..bid_history.len() - 5];
  let total_bidders: usize = eligible_bidders.len();
 
  let mut total_weight = 0;
  let mut total_bid_amount = 0;
  for (i, bid) in eligible_bidders.iter().enumerate() {
      total_weight += total_bidders as u64 - i as u64; 
      total_bid_amount += bid.amount; 
  }
 
  let mut remaining_royalty = royalty_amount;
  for (i, bid) in eligible_bidders.iter().enumerate() {
    let weight = total_bidders as u64 - i as u64;
    let share = (weight * bid.amount) as u64;
    let royalty_share = (share * royalty_amount) / (total_weight * total_bid_amount);
    let total_share = bid.amount + royalty_share;

    transfer_royalty(bid.bidder, total_share, game_account, accounts)?;

    let bid_counts = (i as u64) + 1;
    let (player_pda, _player_bump) = player_pda_seeds(game_id, &bid.bidder, bid_counts, program_id);
    let player_account = find_account(&player_pda, accounts)?;
    let mut player_state =  deserialize_player_state(&player_account.data.borrow())?;

    player_state.safe = true; 
    player_state.royalty_earned += royalty_share; 
    player_state.serialize(&mut &mut player_account.data.borrow_mut()[..])?;
    remaining_royalty = remaining_royalty.saturating_sub(royalty_share);
  }
 
  Ok(())
}

fn transfer_royalty<'a, 'b: 'a>(
  bidder: Pubkey,
  amount: u64,
  game_account: &'a AccountInfo<'b>,
  accounts: &'a [AccountInfo<'b>],
) -> ProgramResult {
  let bidder_account = find_account(&bidder, accounts)
    .map_err(|_| BiddingError::BidderAccountNotFound)?;  

  transfer_from_pda(game_account, bidder_account, amount)
    .map_err(|_| BiddingError::RoyaltyTransferFailed)?;  

  Ok(())
}