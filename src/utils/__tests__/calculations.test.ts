import {
  calculateLineImporte,
  calculateBaseImponible,
  calculateTax,
  calculateIVA,
  calculateTotal,
  roundToTwoDecimals,
} from '../calculations';
import type { LineItem } from '../../types/document';

describe('calculations', () => {
  describe('calculateLineImporte', () => {
    it('should calculate line item total correctly', () => {
      expect(calculateLineImporte(5, 10)).toBe(50);
      expect(calculateLineImporte(3, 25.5)).toBe(76.5);
      expect(calculateLineImporte(1, 99.99)).toBe(99.99);
    });

    it('should handle decimal quantities and prices', () => {
      expect(calculateLineImporte(2.5, 10)).toBe(25);
      expect(calculateLineImporte(1.5, 33.33)).toBe(49.995);
    });

    it('should handle zero values', () => {
      expect(calculateLineImporte(0, 100)).toBe(0);
      expect(calculateLineImporte(10, 0)).toBe(0);
      expect(calculateLineImporte(0, 0)).toBe(0);
    });
  });

  describe('calculateBaseImponible', () => {
    it('should sum all line items', () => {
      const lineas: LineItem[] = [
        {
          id: '1',
          descripcion: 'Item 1',
          cantidad: 2,
          precioUnitario: 10,
          importe: 20,
        },
        {
          id: '2',
          descripcion: 'Item 2',
          cantidad: 3,
          precioUnitario: 15,
          importe: 45,
        },
      ];

      expect(calculateBaseImponible(lineas)).toBe(65);
    });

    it('should return 0 for empty array', () => {
      expect(calculateBaseImponible([])).toBe(0);
    });

    it('should handle single line item', () => {
      const lineas: LineItem[] = [
        {
          id: '1',
          descripcion: 'Single Item',
          cantidad: 1,
          precioUnitario: 100,
          importe: 100,
        },
      ];

      expect(calculateBaseImponible(lineas)).toBe(100);
    });
  });

  describe('calculateTax', () => {
    it('should calculate tax for standard rates', () => {
      expect(calculateTax(100, 21)).toBe(21); // Spanish IVA
      expect(calculateTax(100, 20)).toBe(20); // UK VAT
      expect(calculateTax(100, 19)).toBe(19); // German MwSt
      expect(calculateTax(100, 10)).toBe(10); // Reduced rate
    });

    it('should handle zero tax rate', () => {
      expect(calculateTax(100, 0)).toBe(0);
      expect(calculateTax(1000, 0)).toBe(0);
    });

    it('should handle decimal tax rates', () => {
      expect(calculateTax(100, 5.5)).toBe(5.5); // French super-reduced
      expect(calculateTax(100, 7.5)).toBe(7.5);
    });

    it('should calculate tax for any rate between 0-100', () => {
      expect(calculateTax(100, 1)).toBe(1);
      expect(calculateTax(100, 50)).toBe(50);
      expect(calculateTax(100, 99)).toBe(99);
      expect(calculateTax(100, 100)).toBe(100);
    });

    it('should handle invalid tax rates gracefully', () => {
      // Negative rates should return 0 with warning
      expect(calculateTax(100, -5)).toBe(0);

      // Rates over 100 should return 0 with warning
      expect(calculateTax(100, 150)).toBe(0);
    });

    it('should calculate tax on decimal bases', () => {
      expect(calculateTax(99.99, 21)).toBeCloseTo(20.9979, 4);
      expect(calculateTax(123.45, 20)).toBeCloseTo(24.69, 2);
    });
  });

  describe('calculateIVA (legacy)', () => {
    it('should work for backward compatibility with IVARate', () => {
      expect(calculateIVA(100, 21)).toBe(21);
      expect(calculateIVA(100, 0)).toBe(0);
    });

    it('should produce same results as calculateTax', () => {
      const base = 1000;
      expect(calculateIVA(base, 21)).toBe(calculateTax(base, 21));
      expect(calculateIVA(base, 0)).toBe(calculateTax(base, 0));
    });
  });

  describe('calculateTotal', () => {
    it('should sum base and tax correctly', () => {
      expect(calculateTotal(100, 21)).toBe(121);
      expect(calculateTotal(100, 20)).toBe(120);
      expect(calculateTotal(500, 105)).toBe(605);
    });

    it('should handle zero tax', () => {
      expect(calculateTotal(100, 0)).toBe(100);
    });

    it('should handle decimal values', () => {
      expect(calculateTotal(99.99, 20.99)).toBeCloseTo(120.98, 2);
    });
  });

  describe('roundToTwoDecimals', () => {
    it('should round to 2 decimal places', () => {
      expect(roundToTwoDecimals(10.123)).toBe(10.12);
      expect(roundToTwoDecimals(10.126)).toBe(10.13);
      expect(roundToTwoDecimals(10.125)).toBe(10.13); // Round half up
    });

    it('should handle whole numbers', () => {
      expect(roundToTwoDecimals(10)).toBe(10);
      expect(roundToTwoDecimals(100)).toBe(100);
    });

    it('should handle single decimal', () => {
      expect(roundToTwoDecimals(10.1)).toBe(10.1);
      expect(roundToTwoDecimals(10.9)).toBe(10.9);
    });

    it('should handle very small numbers', () => {
      expect(roundToTwoDecimals(0.001)).toBe(0);
      expect(roundToTwoDecimals(0.005)).toBe(0.01);
      expect(roundToTwoDecimals(0.009)).toBe(0.01);
    });
  });

  describe('Integration: Full invoice calculation', () => {
    it('should calculate complete invoice with 21% tax', () => {
      const lineas: LineItem[] = [
        {
          id: '1',
          descripcion: 'Service 1',
          cantidad: 2,
          precioUnitario: 50,
          importe: 100,
        },
        {
          id: '2',
          descripcion: 'Service 2',
          cantidad: 3,
          precioUnitario: 30,
          importe: 90,
        },
      ];

      const base = calculateBaseImponible(lineas); // 190
      const tax = calculateTax(base, 21); // 39.9
      const total = calculateTotal(base, tax); // 229.9

      expect(base).toBe(190);
      expect(tax).toBe(39.9);
      expect(total).toBe(229.9);
    });

    it('should calculate complete invoice with 0% tax (reverse charge)', () => {
      const lineas: LineItem[] = [
        {
          id: '1',
          descripcion: 'EU Service',
          cantidad: 1,
          precioUnitario: 1000,
          importe: 1000,
        },
      ];

      const base = calculateBaseImponible(lineas);
      const tax = calculateTax(base, 0); // Reverse charge
      const total = calculateTotal(base, tax);

      expect(base).toBe(1000);
      expect(tax).toBe(0);
      expect(total).toBe(1000);
    });

    it('should calculate invoice with reduced 10% tax rate', () => {
      const lineas: LineItem[] = [
        {
          id: '1',
          descripcion: 'Books',
          cantidad: 5,
          precioUnitario: 20,
          importe: 100,
        },
      ];

      const base = calculateBaseImponible(lineas);
      const tax = roundToTwoDecimals(calculateTax(base, 10));
      const total = roundToTwoDecimals(calculateTotal(base, tax));

      expect(base).toBe(100);
      expect(tax).toBe(10);
      expect(total).toBe(110);
    });
  });
});
