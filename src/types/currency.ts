// src/types/currency.ts

/**
 * Currency configuration for formatting monetary values
 */
export interface CurrencyConfig {
  /** ISO 4217 currency code (e.g., "EUR", "USD", "GBP") */
  code: string;

  /** Currency symbol (e.g., "€", "$", "£") */
  symbol: string;

  /** Symbol position relative to amount */
  position: 'before' | 'after';

  /** Decimal separator character */
  decimalSeparator: '.' | ',';

  /** Thousands separator character */
  thousandsSeparator: '.' | ',' | ' ' | '';

  /** Number of decimal places (typically 2) */
  decimals: number;

  /** Full currency name */
  name: string;
}

/**
 * Supported currency codes (ISO 4217)
 */
export type CurrencyCode =
  | 'EUR'  // Euro
  | 'USD'  // US Dollar
  | 'GBP'  // British Pound
  | 'CAD'  // Canadian Dollar
  | 'AUD'  // Australian Dollar
  | 'MXN'  // Mexican Peso
  | 'CHF'  // Swiss Franc
  | 'JPY'; // Japanese Yen
