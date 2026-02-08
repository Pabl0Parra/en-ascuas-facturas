export interface TaxPresetConfig {
  name: string;
  rate: number;
}

export interface CountryDefaults {
  taxIdLabel: string; // "NIF", "VAT", "EIN", etc.
  taxName: string; // "IVA", "VAT", "GST", etc.
  defaultTaxRate: number; // Primary tax rate (percentage)
  currency: string; // ISO 4217 currency code
  locale: string; // BCP 47 locale code
  taxPresets: TaxPresetConfig[]; // Common tax rates for this country
  invoicePrefix: string; // Suggested invoice prefix
  quotePrefix: string; // Suggested quote prefix
}

export const COUNTRY_DEFAULTS: Record<string, CountryDefaults> = {
  ES: {
    taxIdLabel: 'NIF',
    taxName: 'IVA',
    defaultTaxRate: 21,
    currency: 'EUR',
    locale: 'es-ES',
    taxPresets: [
      { name: 'IVA General', rate: 21 },
      { name: 'IVA Reducido', rate: 10 },
      { name: 'IVA Superreducido', rate: 4 },
      { name: 'Exento (ISP)', rate: 0 },
    ],
    invoicePrefix: 'FA-',
    quotePrefix: 'PRE-',
  },
  GB: {
    taxIdLabel: 'VAT',
    taxName: 'VAT',
    defaultTaxRate: 20,
    currency: 'GBP',
    locale: 'en-GB',
    taxPresets: [
      { name: 'Standard VAT', rate: 20 },
      { name: 'Reduced VAT', rate: 5 },
      { name: 'Zero Rate', rate: 0 },
    ],
    invoicePrefix: 'INV-',
    quotePrefix: 'QUO-',
  },
  US: {
    taxIdLabel: 'EIN',
    taxName: 'Sales Tax',
    defaultTaxRate: 0, // Varies by state
    currency: 'USD',
    locale: 'en-US',
    taxPresets: [
      { name: 'No Tax', rate: 0 },
      { name: 'State Tax', rate: 7 }, // User-configurable
    ],
    invoicePrefix: 'INV-',
    quotePrefix: 'QUO-',
  },
  DE: {
    taxIdLabel: 'USt-IdNr',
    taxName: 'MwSt',
    defaultTaxRate: 19,
    currency: 'EUR',
    locale: 'de-DE',
    taxPresets: [
      { name: 'Standard MwSt', rate: 19 },
      { name: 'Ermäßigt', rate: 7 },
      { name: 'Befreit', rate: 0 },
    ],
    invoicePrefix: 'RE-',
    quotePrefix: 'AN-',
  },
  FR: {
    taxIdLabel: 'TVA',
    taxName: 'TVA',
    defaultTaxRate: 20,
    currency: 'EUR',
    locale: 'fr-FR',
    taxPresets: [
      { name: 'TVA Normale', rate: 20 },
      { name: 'TVA Réduite', rate: 10 },
      { name: 'TVA Super-réduite', rate: 5.5 },
      { name: 'Exonéré', rate: 0 },
    ],
    invoicePrefix: 'FACT-',
    quotePrefix: 'DEVIS-',
  },
  IT: {
    taxIdLabel: 'P.IVA',
    taxName: 'IVA',
    defaultTaxRate: 22,
    currency: 'EUR',
    locale: 'it-IT',
    taxPresets: [
      { name: 'IVA Ordinaria', rate: 22 },
      { name: 'IVA Ridotta', rate: 10 },
      { name: 'IVA Minima', rate: 4 },
      { name: 'Esente', rate: 0 },
    ],
    invoicePrefix: 'FATT-',
    quotePrefix: 'PREV-',
  },
  PT: {
    taxIdLabel: 'NIF',
    taxName: 'IVA',
    defaultTaxRate: 23,
    currency: 'EUR',
    locale: 'pt-PT',
    taxPresets: [
      { name: 'IVA Normal', rate: 23 },
      { name: 'IVA Intermédio', rate: 13 },
      { name: 'IVA Reduzido', rate: 6 },
      { name: 'Isento', rate: 0 },
    ],
    invoicePrefix: 'FAT-',
    quotePrefix: 'ORC-',
  },
  CA: {
    taxIdLabel: 'GST/HST',
    taxName: 'GST',
    defaultTaxRate: 5,
    currency: 'CAD',
    locale: 'en-CA',
    taxPresets: [
      { name: 'GST', rate: 5 },
      { name: 'HST', rate: 13 },
      { name: 'No Tax', rate: 0 },
    ],
    invoicePrefix: 'INV-',
    quotePrefix: 'QUO-',
  },
  AU: {
    taxIdLabel: 'ABN',
    taxName: 'GST',
    defaultTaxRate: 10,
    currency: 'AUD',
    locale: 'en-AU',
    taxPresets: [
      { name: 'GST', rate: 10 },
      { name: 'GST-Free', rate: 0 },
    ],
    invoicePrefix: 'INV-',
    quotePrefix: 'QUO-',
  },
  MX: {
    taxIdLabel: 'RFC',
    taxName: 'IVA',
    defaultTaxRate: 16,
    currency: 'MXN',
    locale: 'es-MX',
    taxPresets: [
      { name: 'IVA General', rate: 16 },
      { name: 'Exento', rate: 0 },
    ],
    invoicePrefix: 'FACT-',
    quotePrefix: 'COT-',
  },
};

/**
 * Get country defaults for a given country code.
 * Falls back to generic defaults if country not found.
 */
export function getCountryDefaults(countryCode: string): CountryDefaults {
  return COUNTRY_DEFAULTS[countryCode.toUpperCase()] || {
    taxIdLabel: 'Tax ID',
    taxName: 'Tax',
    defaultTaxRate: 0,
    currency: 'USD',
    locale: 'en-US',
    taxPresets: [
      { name: 'Standard Rate', rate: 0 },
      { name: 'No Tax', rate: 0 },
    ],
    invoicePrefix: 'INV-',
    quotePrefix: 'QUO-',
  };
}

/**
 * Get a list of all supported countries for selection.
 */
export function getSupportedCountries(): Array<{ code: string; name: string }> {
  return [
    { code: 'ES', name: 'Spain' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'PT', name: 'Portugal' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'MX', name: 'Mexico' },
  ];
}
