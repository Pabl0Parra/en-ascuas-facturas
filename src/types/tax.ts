/**
 * Tax preset for quick selection in forms
 */
export interface TaxPreset {
  id: string;
  name: string; // "Standard VAT", "IVA Reducido", "GST"
  rate: number; // 0-100 (percentage)
  isDefault: boolean;
  createdAt: string;
}

/**
 * Tax configuration for the business
 */
export interface TaxConfig {
  taxName: string; // "IVA", "VAT", "GST", "Sales Tax"
  presets: TaxPreset[];
  allowPerLineItemTax: boolean; // Future: different tax per line item
  reverseChargeEnabled: boolean; // For "Inversión del Sujeto Pasivo", "Reverse Charge"
  reverseChargeLabel: string; // Localized label for reverse charge
}

/**
 * Tax treatment options for documents
 */
export type TaxTreatment =
  | 'standard'        // Apply normal tax rate
  | 'reverse-charge'  // Reverse charge / ISP (0% but noted)
  | 'exempt'          // Tax exempt
  | 'custom';         // Custom rate

/**
 * Form data for creating/editing tax presets
 */
export type TaxPresetFormData = Omit<TaxPreset, 'id' | 'createdAt'>;
