import {
  CURRENCY_CONFIGS,
  getCurrencyConfig,
  getSupportedCurrencies,
  isCurrencySupported,
} from '../currencyConfig';

describe('currencyConfig', () => {
  describe('CURRENCY_CONFIGS', () => {
    it('should export all currency configurations', () => {
      expect(CURRENCY_CONFIGS).toHaveProperty('EUR');
      expect(CURRENCY_CONFIGS).toHaveProperty('USD');
      expect(CURRENCY_CONFIGS).toHaveProperty('GBP');
      expect(CURRENCY_CONFIGS).toHaveProperty('CAD');
      expect(CURRENCY_CONFIGS).toHaveProperty('AUD');
      expect(CURRENCY_CONFIGS).toHaveProperty('MXN');
      expect(CURRENCY_CONFIGS).toHaveProperty('CHF');
      expect(CURRENCY_CONFIGS).toHaveProperty('JPY');
    });

    it('should have correct EUR configuration', () => {
      expect(CURRENCY_CONFIGS.EUR).toEqual({
        code: 'EUR',
        symbol: '€',
        position: 'after',
        decimalSeparator: ',',
        thousandsSeparator: '.',
        decimals: 2,
        name: 'Euro',
      });
    });

    it('should have correct USD configuration', () => {
      expect(CURRENCY_CONFIGS.USD).toEqual({
        code: 'USD',
        symbol: '$',
        position: 'before',
        decimalSeparator: '.',
        thousandsSeparator: ',',
        decimals: 2,
        name: 'US Dollar',
      });
    });

    it('should have correct GBP configuration', () => {
      expect(CURRENCY_CONFIGS.GBP).toEqual({
        code: 'GBP',
        symbol: '£',
        position: 'before',
        decimalSeparator: '.',
        thousandsSeparator: ',',
        decimals: 2,
        name: 'British Pound',
      });
    });

    it('should have correct JPY configuration (no decimals)', () => {
      expect(CURRENCY_CONFIGS.JPY).toEqual({
        code: 'JPY',
        symbol: '¥',
        position: 'before',
        decimalSeparator: '.',
        thousandsSeparator: ',',
        decimals: 0,
        name: 'Japanese Yen',
      });
    });

    it('should have all required fields for each currency', () => {
      Object.values(CURRENCY_CONFIGS).forEach((config) => {
        expect(config).toHaveProperty('code');
        expect(config).toHaveProperty('symbol');
        expect(config).toHaveProperty('position');
        expect(config).toHaveProperty('decimalSeparator');
        expect(config).toHaveProperty('thousandsSeparator');
        expect(config).toHaveProperty('decimals');
        expect(config).toHaveProperty('name');
      });
    });
  });

  describe('getCurrencyConfig', () => {
    it('should return EUR configuration', () => {
      const config = getCurrencyConfig('EUR');
      expect(config.code).toBe('EUR');
      expect(config.symbol).toBe('€');
    });

    it('should return USD configuration', () => {
      const config = getCurrencyConfig('USD');
      expect(config.code).toBe('USD');
      expect(config.symbol).toBe('$');
    });

    it('should return GBP configuration', () => {
      const config = getCurrencyConfig('GBP');
      expect(config.code).toBe('GBP');
      expect(config.symbol).toBe('£');
    });

    it('should fallback to EUR for unsupported currency', () => {
      const config = getCurrencyConfig('INVALID');
      expect(config.code).toBe('EUR');
      expect(config.symbol).toBe('€');
    });

    it('should fallback to EUR for empty string', () => {
      const config = getCurrencyConfig('');
      expect(config.code).toBe('EUR');
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return array of currency codes', () => {
      const currencies = getSupportedCurrencies();
      expect(Array.isArray(currencies)).toBe(true);
      expect(currencies.length).toBeGreaterThan(0);
    });

    it('should include all main currencies', () => {
      const currencies = getSupportedCurrencies();
      expect(currencies).toContain('EUR');
      expect(currencies).toContain('USD');
      expect(currencies).toContain('GBP');
      expect(currencies).toContain('CAD');
      expect(currencies).toContain('AUD');
    });

    it('should return exactly 8 currencies', () => {
      const currencies = getSupportedCurrencies();
      expect(currencies).toHaveLength(8);
    });
  });

  describe('isCurrencySupported', () => {
    it('should return true for EUR', () => {
      expect(isCurrencySupported('EUR')).toBe(true);
    });

    it('should return true for USD', () => {
      expect(isCurrencySupported('USD')).toBe(true);
    });

    it('should return true for all supported currencies', () => {
      const currencies = getSupportedCurrencies();
      currencies.forEach((code) => {
        expect(isCurrencySupported(code)).toBe(true);
      });
    });

    it('should return false for unsupported currency', () => {
      expect(isCurrencySupported('INVALID')).toBe(false);
      expect(isCurrencySupported('XYZ')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isCurrencySupported('')).toBe(false);
    });
  });
});
