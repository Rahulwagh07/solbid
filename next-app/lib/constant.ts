import { Connection, PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey('71Q2euxEEAzcqFBNNgAgUaTTE63dJaVioLmKx7AKMpSB');
export const CONNECTION = new Connection("https://api.devnet.solana.com", "confirmed");
export const PLATFROM_ACCOUNT = new PublicKey('7UxgfmMiNMbjHxEayn51uRjkeyrMiR4pPXWbo8sFUrsG')