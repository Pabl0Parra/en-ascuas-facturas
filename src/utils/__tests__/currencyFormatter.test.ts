import {
  formatCurrency,
  formatCurrencyByCode,
  formatCurrencyIntl,
  parseCurrency,
  formatCurrencyCompact,
} from '../currencyFormatter';
import { CURRENCY_CONFIGS } from '../../config/currencyConfig';

describe('currencyFormatter', () => {
  describe('formatCurrency', () => {
    it('should format EUR correctly', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('1.234,56 €');
    });

    it('should format USD correctly', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.USD);
      expect(result).toBe('$1,234.56');
    });

    it('should format GBP correctly', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.GBP);
      expect(result).toBe('£1,234.56');
    });

    it('should format CAD correctly', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.CAD);
      expect(result).toBe('CA$1,234.56');
    });

    it('should format AUD correctly', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.AUD);
      expect(result).toBe('A$1,234.56');
    });

    it('should format JPY correctly (no decimals)', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.JPY);
      expect(result).toBe('¥1,235'); // Rounded to nearest whole number
    });

    it('should format CHF correctly (apostrophe separator)', () => {
      const result = formatCurrency(1234.56, CURRENCY_CONFIGS.CHF);
      expect(result).toBe("CHF1'234.56");
    });

    it('should handle zero', () => {
      const result = formatCurrency(0, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('0,00 €');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-1234.56, CURRENCY_CONFIGS.USD);
      expect(result).toBe('$-1,234.56');
    });

    it('should handle very large numbers', () => {
      const result = formatCurrency(1234567.89, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('1.234.567,89 €');
    });

    it('should handle NaN gracefully', () => {
      const result = formatCurrency(NaN, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('0,00 €');
    });

    it('should handle Infinity gracefully', () => {
      const result = formatCurrency(Infinity, CURRENCY_CONFIGS.USD);
      expect(result).toBe('$0.00');
    });

    it('should round to correct decimal places', () => {
      const result = formatCurrency(1234.567, CURRENCY_CONFIGS.USD);
      expect(result).toBe('$1,234.57'); // Rounded up
    });
  });

  describe('formatCurrencyByCode', () => {
    it('should format EUR by code', () => {
      const result = formatCurrencyByCode(1234.56, 'EUR');
      expect(result).toBe('1.234,56 €');
    });

    it('should format USD by code', () => {
      const result = formatCurrencyByCode(1234.56, 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('should format GBP by code', () => {
      const result = formatCurrencyByCode(1234.56, 'GBP');
      expect(result).toBe('£1,234.56');
    });

    it('should fallback to EUR for invalid code', () => {
      const result = formatCurrencyByCode(1234.56, 'INVALID');
      expect(result).toBe('1.234,56 €');
    });
  });

  describe('formatCurrencyIntl', () => {
    it('should format EUR with Spanish locale', () => {
      const result = formatCurrencyIntl(1234.56, 'EUR', 'es-ES');
      // Note: Intl output may vary slightly by environment
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
      expect(result).toContain('€');
    });

    it('should format USD with English locale', () => {
      const result = formatCurrencyIntl(1234.56, 'USD', 'en-US');
      expect(result).toContain('$');
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('56');
    });

    it('should fallback to formatCurrencyByCode on error', () => {
      const result = formatCurrencyIntl(1234.56, 'INVALID', 'invalid-locale');
      // Should fallback and use EUR
      expect(result).toBe('1.234,56 €');
    });
  });

  describe('parseCurrency', () => {
    it('should parse EUR format', () => {
      const result = parseCurrency('1.234,56 €', CURRENCY_CONFIGS.EUR);
      expect(result).toBe(1234.56);
    });

    it('should parse USD format', () => {
      const result = parseCurrency('$1,234.56', CURRENCY_CONFIGS.USD);
      expect(result).toBe(1234.56);
    });

    it('should parse GBP format', () => {
      const result = parseCurrency('£1,234.56', CURRENCY_CONFIGS.GBP);
      expect(result).toBe(1234.56);
    });

    it('should parse JPY format (no decimals)', () => {
      const result = parseCurrency('¥1,235', CURRENCY_CONFIGS.JPY);
      expect(result).toBe(1235);
    });

    it('should handle formats without thousands separator', () => {
      const result = parseCurrency('123,45 €', CURRENCY_CONFIGS.EUR);
      expect(result).toBe(123.45);
    });

    it('should return 0 for invalid input', () => {
      const result = parseCurrency('invalid', CURRENCY_CONFIGS.EUR);
      expect(result).toBe(0);
    });

    it('should return 0 for empty string', () => {
      const result = parseCurrency('', CURRENCY_CONFIGS.EUR);
      expect(result).toBe(0);
    });
  });

  describe('formatCurrencyCompact', () => {
    it('should format thousands with K suffix', () => {
      const result = formatCurrencyCompact(1234.56, 'EUR');
      expect(result).toBe('1.2K €');
    });

    it('should format millions with M suffix', () => {
      const result = formatCurrencyCompact(1234567, 'USD');
      expect(result).toBe('$1.2M');
    });

    it('should format small amounts without suffix', () => {
      const result = formatCurrencyCompact(123.45, 'GBP');
      expect(result).toBe('£123.45');
    });

    it('should format exactly 1000 with K suffix', () => {
      const result = formatCurrencyCompact(1000, 'EUR');
      expect(result).toBe('1.0K €');
    });

    it('should format exactly 1000000 with M suffix', () => {
      const result = formatCurrencyCompact(1000000, 'USD');
      expect(result).toBe('$1.0M');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrencyCompact(-1234, 'EUR');
      expect(result).toBe('-1.2K €');
    });

    it('should handle JPY (no decimals) for small amounts', () => {
      const result = formatCurrencyCompact(123, 'JPY');
      expect(result).toBe('¥123');
    });
  });

  describe('Integration: Format and Parse', () => {
    it('should parse back to original value for EUR', () => {
      const original = 1234.56;
      const formatted = formatCurrency(original, CURRENCY_CONFIGS.EUR);
      const parsed = parseCurrency(formatted, CURRENCY_CONFIGS.EUR);
      expect(parsed).toBe(original);
    });

    it('should parse back to original value for USD', () => {
      const original = 9876.54;
      const formatted = formatCurrency(original, CURRENCY_CONFIGS.USD);
      const parsed = parseCurrency(formatted, CURRENCY_CONFIGS.USD);
      expect(parsed).toBe(original);
    });

    it('should parse back to original value for GBP', () => {
      const original = 5432.10;
      const formatted = formatCurrency(original, CURRENCY_CONFIGS.GBP);
      const parsed = parseCurrency(formatted, CURRENCY_CONFIGS.GBP);
      expect(parsed).toBeCloseTo(original, 2);
    });
  });

  describe('Edge cases', () => {
    it('should handle very small decimals', () => {
      const result = formatCurrency(0.01, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('0,01 €');
    });

    it('should handle rounding 0.005 correctly', () => {
      const result = formatCurrency(0.005, CURRENCY_CONFIGS.USD);
      expect(result).toBe('$0.01'); // Rounds to nearest even (banker's rounding)
    });

    it('should handle numbers with many decimal places', () => {
      const result = formatCurrency(1234.56789, CURRENCY_CONFIGS.EUR);
      expect(result).toBe('1.234,57 €'); // Rounded to 2 decimals
    });
  });
});
