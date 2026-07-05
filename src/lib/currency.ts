const symbols: Record<string, string> = {
  SAR: 'ر.س',
  AED: 'د.إ',
  USD: '$',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  BHD: 'د.ب',
  OMR: 'ر.ع',
}

export function currencySymbol(code: string): string {
  return symbols[code] ?? code
}
