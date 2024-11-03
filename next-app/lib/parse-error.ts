 export function parseTransactionError(error: any): string {
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : '';

  if (errorMessage.includes('user rejected') || 
      errorMessage.includes('user declined')) {
    return 'Transaction cancelled by user';
  }
  if (errorMessage.includes('not connected') || 
      errorMessage.includes('wallet adapter not found') ||
      errorMessage.includes('no wallet found')) {
    return 'Please connect your wallet';
  }
  if (errorMessage.includes('insufficient balance') || 
      errorMessage.includes('insufficient funds') ||
      errorMessage.includes('insufficient lamports')) {
    return 'Insufficient balance in your wallet';
  }
  if (errorMessage.includes('timeout') || 
      errorMessage.includes('timed out')) {
    return 'Transaction timed out. Please try again';
  }
  if (errorMessage.includes('blockhash not found') || 
      errorMessage.includes('block height exceeded') ||
      errorMessage.includes('blockhash expired')) {
    return 'Transaction expired. Please try again';
  }
  if (errorMessage.includes('signature verification failed') || 
      errorMessage.includes('invalid signature')) {
    return 'Transaction signature failed. Please try again';
  }
 
  return 'Please try again';
}