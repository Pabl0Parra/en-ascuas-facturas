import { getCountryDefaults, getSupportedCountries, COUNTRY_DEFAULTS } from '../countryDefaults';

describe('countryDefaults', () => {
  describe('COUNTRY_DEFAULTS', () => {
    it('should have defaults for Spain (ES)', () => {
      const spain = COUNTRY_DEFAULTS.ES;
      expect(spain).toBeDefined();
      expect(spain.taxIdLabel).toBe('NIF');
      expect(spain.taxName).toBe('IVA');
      expect(spain.defaultTaxRate).toBe(21);
      expect(spain.currency).toBe('EUR');
      expect(spain.locale).toBe('es-ES');
      expect(spain.taxPresets).toHaveLength(4);
      expect(spain.invoicePrefix).toBe('FA-');
      expect(spain.quotePrefix).toBe('PRE-');
    });

    it('should have defaults for United Kingdom (GB)', () => {
      const uk = COUNTRY_DEFAULTS.GB;
      expect(uk).toBeDefined();
      expect(uk.taxIdLabel).toBe('VAT');
      expect(uk.taxName).toBe('VAT');
      expect(uk.defaultTaxRate).toBe(20);
      expect(uk.currency).toBe('GBP');
      expect(uk.locale).toBe('en-GB');
      expect(uk.taxPresets).toHaveLength(3);
    });

    it('should have defaults for United States (US)', () => {
      const us = COUNTRY_DEFAULTS.US;
      expect(us).toBeDefined();
      expect(us.taxIdLabel).toBe('EIN');
      expect(us.taxName).toBe('Sales Tax');
      expect(us.defaultTaxRate).toBe(0); // Varies by state
      expect(us.currency).toBe('USD');
      expect(us.locale).toBe('en-US');
    });

    it('should have defaults for Germany (DE)', () => {
      const germany = COUNTRY_DEFAULTS.DE;
      expect(germany).toBeDefined();
      expect(germany.taxIdLabel).toBe('USt-IdNr');
      expect(germany.taxName).toBe('MwSt');
      expect(germany.defaultTaxRate).toBe(19);
      expect(germany.currency).toBe('EUR');
      expect(germany.locale).toBe('de-DE');
    });

    it('should have defaults for France (FR)', () => {
      const france = COUNTRY_DEFAULTS.FR;
      expect(france).toBeDefined();
      expect(france.taxIdLabel).toBe('TVA');
      expect(france.taxName).toBe('TVA');
      expect(france.defaultTaxRate).toBe(20);
      expect(france.currency).toBe('EUR');
      expect(france.locale).toBe('fr-FR');
    });

    it('should have tax presets with name and rate for each country', () => {
      Object.entries(COUNTRY_DEFAULTS).forEach(([countryCode, defaults]) => {
        expect(defaults.taxPresets).toBeInstanceOf(Array);
        expect(defaults.taxPresets.length).toBeGreaterThan(0);

        defaults.taxPresets.forEach(preset => {
          expect(preset).toHaveProperty('name');
          expect(preset).toHaveProperty('rate');
          expect(typeof preset.name).toBe('string');
          expect(typeof preset.rate).toBe('number');
          expect(preset.rate).toBeGreaterThanOrEqual(0);
          expect(preset.rate).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe('getCountryDefaults', () => {
    it('should return defaults for a valid country code', () => {
      const spain = getCountryDefaults('ES');
      expect(spain.taxName).toBe('IVA');
      expect(spain.currency).toBe('EUR');
    });

    it('should be case-insensitive', () => {
      const spainLower = getCountryDefaults('es');
      const spainUpper = getCountryDefaults('ES');
      expect(spainLower).toEqual(spainUpper);
    });

    it('should return generic defaults for unknown country code', () => {
      const unknown = getCountryDefaults('XX');
      expect(unknown.taxIdLabel).toBe('Tax ID');
      expect(unknown.taxName).toBe('Tax');
      expect(unknown.defaultTaxRate).toBe(0);
      expect(unknown.currency).toBe('USD');
      expect(unknown.locale).toBe('en-US');
      expect(unknown.invoicePrefix).toBe('INV-');
      expect(unknown.quotePrefix).toBe('QUO-');
    });

    it('should return generic defaults for empty string', () => {
      const empty = getCountryDefaults('');
      expect(empty.taxIdLabel).toBe('Tax ID');
    });
  });

  describe('getSupportedCountries', () => {
    it('should return an array of supported countries', () => {
      const countries = getSupportedCountries();
      expect(countries).toBeInstanceOf(Array);
      expect(countries.length).toBeGreaterThan(0);
    });

    it('should have code and name for each country', () => {
      const countries = getSupportedCountries();
      countries.forEach(country => {
        expect(country).toHaveProperty('code');
        expect(country).toHaveProperty('name');
        expect(typeof country.code).toBe('string');
        expect(typeof country.name).toBe('string');
        expect(country.code.length).toBe(2); // ISO 3166-1 alpha-2
      });
    });

    it('should include Spain, UK, US, Germany, and France', () => {
      const countries = getSupportedCountries();
      const codes = countries.map(c => c.code);
      expect(codes).toContain('ES');
      expect(codes).toContain('GB');
      expect(codes).toContain('US');
      expect(codes).toContain('DE');
      expect(codes).toContain('FR');
    });

    it('should match COUNTRY_DEFAULTS keys', () => {
      const countries = getSupportedCountries();
      const supportedCodes = countries.map(c => c.code);
      const defaultsCodes = Object.keys(COUNTRY_DEFAULTS);

      supportedCodes.forEach(code => {
        expect(defaultsCodes).toContain(code);
      });
    });
  });
});
