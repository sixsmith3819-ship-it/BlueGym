/**
 * Currency formatting utilities
 */

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  ZMW: 'K', // Zambian Kwacha
  ZWL: 'Z$', // Zimbabwean Dollar
  ZAR: 'R', // South African Rand
  KES: 'KSh', // Kenyan Shilling
  TZS: 'TSh', // Tanzanian Shilling
  UGX: 'USh', // Ugandan Shilling
}

export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = getCurrencySymbol(currencyCode)
  const formattedAmount = amount.toFixed(2)
  
  // For currencies that use symbol before amount
  if (['USD', 'EUR', 'GBP', 'ZAR'].includes(currencyCode)) {
    return `${symbol}${formattedAmount}`
  }
  
  // For currencies that use symbol after amount
  return `${symbol}${formattedAmount}`
}
