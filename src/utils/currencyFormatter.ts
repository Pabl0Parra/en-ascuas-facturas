// src/utils/currencyFormatter.ts
import type { CurrencyConfig } from '../types/currency';
import { getCurrencyConfig } from '../config/currencyConfig';

/**
 * Format a number as currency using custom configuration
 *
 * @param amount - The numeric amount to format
 * @param config - Currency configuration
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, CURRENCY_CONFIGS.EUR) // "1.234,56 €"
 * formatCurrency(1234.56, CURRENCY_CONFIGS.USD) // "$1,234.56"
 */
export const formatCurrency = (amount: number, config: CurrencyConfig): string => {
  // Handle edge cases
  if (isNaN(amount) || !isFinite(amount)) {
    return config.position === 'before'
      ? `${config.symbol}0${config.decimalSeparator}00`
      : `0${config.decimalSeparator}00 ${config.symbol}`;
  }

  // Round to specified decimal places
  const rounded = Number(amount.toFixed(config.decimals));

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = rounded.toFixed(config.decimals).split('.');

  // Add thousands separator
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    config.thousandsSeparator
  );

  // Build the formatted number
  const formattedNumber =
    config.decimals > 0
      ? `${formattedInteger}${config.decimalSeparator}${decimalPart}`
      : formattedInteger;

  // Add currency symbol in correct position
  return config.position === 'before'
    ? `${config.symbol}${formattedNumber}`
    : `${formattedNumber} ${config.symbol}`;
};

/**
 * Format amount using currency code (convenience function)
 *
 * @param amount - The numeric amount to format
 * @param currencyCode - ISO 4217 currency code
 * @returns Formatted currency string
 *
 * @example
 * formatCurrencyByCode(1234.56, 'EUR') // "1.234,56 €"
 * formatCurrencyByCode(1234.56, 'USD') // "$1,234.56"
 */
export const formatCurrencyByCode = (
  amount: number,
  currencyCode: string
): string => {
  const config = getCurrencyConfig(currencyCode);
  return formatCurrency(amount, config);
};

/**
 * Format amount using Intl.NumberFormat (browser/native API)
 *
 * More accurate for locale-specific formatting, but less customizable
 *
 * @param amount - The numeric amount to format
 * @param currencyCode - ISO 4217 currency code
 * @param locale - BCP 47 locale code (e.g., "es-ES", "en-US")
 * @returns Formatted currency string
 *
 * @example
 * formatCurrencyIntl(1234.56, 'EUR', 'es-ES') // "1.234,56 €"
 * formatCurrencyIntl(1234.56, 'USD', 'en-US') // "$1,234.56"
 */
export const formatCurrencyIntl = (
  amount: number,
  currencyCode: string,
  locale: string
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.warn(
      `Failed to format currency with Intl.NumberFormat (${currencyCode}, ${locale}):`,
      error
    );
    // Fallback to custom formatter
    return formatCurrencyByCode(amount, currencyCode);
  }
};

/**
 * Parse a formatted currency string to a number
 *
 * @param formattedAmount - Formatted currency string
 * @param config - Currency configuration
 * @returns Numeric value or 0 if parsing fails
 *
 * @example
 * parseCurrency("1.234,56 €", CURRENCY_CONFIGS.EUR) // 1234.56
 * parseCurrency("$1,234.56", CURRENCY_CONFIGS.USD) // 1234.56
 */
export const parseCurrency = (
  formattedAmount: string,
  config: CurrencyConfig
): number => {
  try {
    // Remove currency symbol
    let cleaned = formattedAmount.replace(config.symbol, '').trim();

    // Replace thousands separator with empty string
    if (config.thousandsSeparator) {
      cleaned = cleaned.split(config.thousandsSeparator).join('');
    }

    // Replace decimal separator with dot
    if (config.decimalSeparator === ',') {
      cleaned = cleaned.replace(',', '.');
    }

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  } catch (error) {
    console.warn('Failed to parse currency:', formattedAmount, error);
    return 0;
  }
};

/**
 * Get a compact currency representation (for small spaces)
 *
 * @param amount - The numeric amount to format
 * @param currencyCode - ISO 4217 currency code
 * @returns Compact currency string
 *
 * @example
 * formatCurrencyCompact(1234.56, 'EUR') // "1.2K €"
 * formatCurrencyCompact(1234567, 'USD') // "$1.2M"
 */
export const formatCurrencyCompact = (
  amount: number,
  currencyCode: string
): string => {
  const config = getCurrencyConfig(currencyCode);

  const absAmount = Math.abs(amount);
  let suffix = '';
  let divisor = 1;

  if (absAmount >= 1000000) {
    suffix = 'M';
    divisor = 1000000;
  } else if (absAmount >= 1000) {
    suffix = 'K';
    divisor = 1000;
  }

  const compactValue = amount / divisor;
  const formatted =
    suffix !== ''
      ? `${compactValue.toFixed(1)}${suffix}`
      : compactValue.toFixed(config.decimals);

  return config.position === 'before'
    ? `${config.symbol}${formatted}`
    : `${formatted} ${config.symbol}`;
};
