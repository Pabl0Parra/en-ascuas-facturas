import { formatCurrencyByCode, formatCurrencyIntl } from './currencyFormatter';

/**
 * @deprecated Use formatCurrencyByCode or formatCurrencyIntl instead
 * Legacy function - kept for backward compatibility
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * @deprecated Use formatCurrencyByCode('EUR') or formatCurrencyIntl instead
 * Legacy function - kept for backward compatibility
 */
export const formatCurrencyWithSymbol = (amount: number): string => {
  return `${formatCurrency(amount)} €`;
};

/**
 * Format currency with dynamic currency code and locale
 *
 * @param amount - Amount to format
 * @param currencyCode - ISO 4217 currency code (default: 'EUR')
 * @param locale - BCP 47 locale code (default: 'es-ES')
 * @returns Formatted currency string
 */
export const formatCurrencyDynamic = (
  amount: number,
  currencyCode: string = 'EUR',
  locale: string = 'es-ES'
): string => {
  return formatCurrencyIntl(amount, currencyCode, locale);
};

export const formatDate = (dateString: string): string => {
  // If already in dd-mm-yyyy format, return as is
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString;
  }

  // Otherwise try to parse and format
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

export const formatDateLong = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateForPDF = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

export const getTodayISO = (): string => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};
