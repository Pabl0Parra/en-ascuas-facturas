import type { LineItem, IVARate } from '../types/document';

/**
 * Calculate line item total (quantity × unit price)
 */
export const calculateLineImporte = (
  cantidad: number,
  precioUnitario: number
): number => {
  return cantidad * precioUnitario;
};

/**
 * Calculate subtotal from all line items
 */
export const calculateBaseImponible = (lineas: LineItem[]): number => {
  return lineas.reduce((sum, linea) => sum + linea.importe, 0);
};

/**
 * Calculate tax amount with dynamic rate (0-100%)
 * This replaces the old calculateIVA function
 */
export const calculateTax = (base: number, taxRate: number): number => {
  if (taxRate < 0 || taxRate > 100) {
    console.warn(`Invalid tax rate: ${taxRate}%. Using 0%.`);
    return 0;
  }
  return base * (taxRate / 100);
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use calculateTax instead
 */
export const calculateIVA = (base: number, rate: IVARate): number => {
  return calculateTax(base, rate);
};

/**
 * Calculate grand total (subtotal + tax)
 */
export const calculateTotal = (base: number, tax: number): number => {
  return base + tax;
};

/**
 * Round to 2 decimal places for monetary values
 */
export const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};
