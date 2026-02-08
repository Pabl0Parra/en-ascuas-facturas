// src/config/currencyConfig.ts
import type { CurrencyConfig, CurrencyCode } from '../types/currency';

/**
 * Currency configurations for all supported currencies
 *
 * Based on ISO 4217 standards and regional formatting conventions
 */
export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    position: 'after',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: 2,
    name: 'Euro',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
    name: 'US Dollar',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
    name: 'British Pound',
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
    name: 'Canadian Dollar',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
    name: 'Australian Dollar',
  },
  MXN: {
    code: 'MXN',
    symbol: 'MX$',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 2,
    name: 'Mexican Peso',
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: "'",
    decimals: 2,
    name: 'Swiss Franc',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    position: 'before',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    decimals: 0, // Yen has no decimal places
    name: 'Japanese Yen',
  },
};

/**
 * Get currency configuration by code
 *
 * @param code - ISO 4217 currency code
 * @returns Currency configuration or EUR as fallback
 */
export const getCurrencyConfig = (code: string): CurrencyConfig => {
  const config = CURRENCY_CONFIGS[code as CurrencyCode];

  if (!config) {
    console.warn(`Currency code "${code}" not supported. Using EUR as fallback.`);
    return CURRENCY_CONFIGS.EUR;
  }

  return config;
};

/**
 * Get all supported currency codes
 *
 * @returns Array of ISO 4217 currency codes
 */
export const getSupportedCurrencies = (): CurrencyCode[] => {
  return Object.keys(CURRENCY_CONFIGS) as CurrencyCode[];
};

/**
 * Check if a currency code is supported
 *
 * @param code - Currency code to check
 * @returns True if supported
 */
export const isCurrencySupported = (code: string): code is CurrencyCode => {
  return code in CURRENCY_CONFIGS;
};
