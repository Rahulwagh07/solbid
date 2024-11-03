use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum BiddingError {
  #[error("Initial bid amount must be at least 0.014 SOL")]
  InsufficientInitialBid,
  #[error("Invalid game account")]
  InvalidGameAccount,
  #[error("Invalid player account")]
  InvalidPlayerAccount,
  #[error("Invalid bid account")]
  InvalidBidAccount,
  #[error("Game has already ended")]
  GameEnded,
  #[error("Bid amount must be at least double the highest bid")]
  InsufficientBidAmount,
  #[error("Invalid new player account")]
  InvalidNewPlayerAccount,
  #[error("Invalid new bid account")]
  InvalidNewBidAccount,
  #[error("No bids found in game")]
  NoBidsFound,
  #[error("No winner found")]
  NoWinnerFound,
  #[error("Bidder account not found")]
  BidderAccountNotFound,
  #[error("System program account not found")]
  SystemProgramNotFound,
  #[error("Failed to fetch bid history")]
  FailedToFetchBidHistory,
  #[error("Bid count not matched")]
  BidCountMismatch,
  #[error("Failed to deserialize bid account data")]
  FailedToDeserializeBidData,
  #[error("Account has insufficient funds")]
  InsufficientFunds,
  #[error("Royalty transfer failed")]
  RoyaltyTransferFailed,
  #[error("Account not found")]
  AccountNotFound,
  #[error("Bid account is not initialized for bid PDA")]
  BidAccountNotInitialized,
  #[error("Bid account not found for bid PDA")]
  BidAccountNotFound,
  #[error("Player account not found")]
  PlayerAccountNotFound,
  #[error("Invalid instruction")]
  InvalidInstruction,
}

impl From<BiddingError> for ProgramError {
  fn from(e: BiddingError) -> Self {
    ProgramError::Custom(e as u32)
  }
}
