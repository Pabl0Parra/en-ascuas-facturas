// src/services/pdfTemplates/classic.ts
import type { PdfTemplateContext } from '../../types/pdfTemplate';
import { formatCurrency } from '../../utils/currencyFormatter';

/**
 * Classic PDF template - Traditional professional layout
 *
 * Ported from original pdfGenerator.ts design
 * Features: Clean lines, traditional header, company branding
 */
export const classicTemplate = (context: PdfTemplateContext): string => {
  const {
    business,
    client,
    document,
    lineItems,
    calculations,
    tax,
    currency,
    translations,
    logoBase64,
    primaryColor,
  } = context;

  const isPresupuesto = document.tipo === 'presupuesto';
  const docLabel = translations['document.' + document.tipo] || document.tipo.toUpperCase();

  // Helper function to format date
  const formatDateForPDF = (dateString: string): string => {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString.replace(/-/g, '/');
    }
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Generate line items HTML
  const lineasHTML = lineItems
    .map(
      (linea) => `
      <tr>
        <td class="desc-cell">${linea.descripcion}</td>
        <td class="center">${linea.cantidad}</td>
        <td class="right">${formatCurrency(linea.precioUnitario, currency)}</td>
        <td class="right">${formatCurrency(linea.importe, currency)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 11px;
          color: #1a1a1a;
          padding: 25px;
          max-width: 210mm;
          line-height: 1.4;
        }

        /* Header with logo */
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid ${primaryColor};
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo-img {
          width: 70px;
          height: 70px;
          object-fit: contain;
        }
        .company-name {
          font-size: 24px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: 2px;
        }
        .doc-type {
          text-align: right;
        }
        .doc-type-label {
          font-size: 22px;
          font-weight: bold;
          color: ${primaryColor};
        }
        .doc-number {
          font-size: 14px;
          color: #333;
          margin-top: 5px;
        }

        /* Data sections */
        .datos-container {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 20px;
        }
        .datos-section {
          width: 48%;
          background: #fafafa;
          padding: 12px;
          border-radius: 4px;
        }
        .datos-title {
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 8px;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .datos-row {
          margin-bottom: 3px;
          font-size: 11px;
          color: #333;
        }
        .datos-row.name {
          font-weight: bold;
          font-size: 12px;
          color: #1a1a1a;
        }

        /* Document info */
        .doc-info {
          background: #1a1a1a;
          color: #fff;
          padding: 10px 15px;
          margin-bottom: 20px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th {
          background: ${primaryColor};
          color: #fff;
          padding: 10px 12px;
          text-align: left;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        th.center { text-align: center; }
        th.right { text-align: right; }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #eee;
          font-size: 11px;
        }
        td.center { text-align: center; }
        td.right { text-align: right; }
        td.desc-cell {
          max-width: 200px;
        }
        tr:nth-child(even) {
          background: #fafafa;
        }

        /* Tax note */
        .tax-note {
          padding: 10px 15px;
          font-style: italic;
          color: #666;
          background: #fff3cd;
          border-left: 3px solid #ffc107;
          margin-bottom: 15px;
          font-size: 10px;
        }

        /* Comments */
        .comments-section {
          margin: 20px 0 15px 0;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fafafa;
        }
        .comments-title {
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 8px;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .comments-text {
          font-size: 10px;
          color: #555;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        /* Footer */
        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid #1a1a1a;
        }
        .payment-info {
          width: 50%;
        }
        .payment-title {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 10px;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .payment-detail {
          font-size: 11px;
          color: #333;
          margin-bottom: 3px;
        }
        .totals {
          width: 45%;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 11px;
          padding: 3px 0;
        }
        .total-final {
          font-weight: bold;
          font-size: 16px;
          background: ${primaryColor};
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          margin-top: 8px;
        }

        /* Legal footer */
        .legal-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 9px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <!-- Header with logo -->
      <div class="header-top">
        <div class="logo-section">
          ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" />` : ''}
          <div>
            <div class="company-name">${business.companyName}</div>
          </div>
        </div>
        <div class="doc-type">
          <div class="doc-type-label">${docLabel}</div>
          ${document.numeroDocumento ? `<div class="doc-number">Nº ${document.numeroDocumento}</div>` : ''}
        </div>
      </div>

      <!-- Business and client data -->
      <div class="datos-container">
        <div class="datos-section">
          <div class="datos-title">${translations['document.datosEmpresa'] || 'Business Data'}</div>
          <div class="datos-row name">${business.companyName}</div>
          <div class="datos-row">${business.address}</div>
          <div class="datos-row">${business.postalCode} ${business.city}</div>
          <div class="datos-row">${business.region}</div>
          <div class="datos-row">${business.taxIdLabel}: ${business.taxId}</div>
        </div>
        <div class="datos-section">
          <div class="datos-title">${translations['document.datosFacturacion'] || 'Client Data'}</div>
          <div class="datos-row name">${client.nombre}</div>
          <div class="datos-row">${client.direccion}</div>
          <div class="datos-row">${client.codigoPostal} ${client.ciudad}</div>
          <div class="datos-row">${client.provincia}</div>
          <div class="datos-row">${business.taxIdLabel}: ${client.nifCif}</div>
        </div>
      </div>

      <!-- Document info -->
      <div class="doc-info">
        <span><strong>${translations['document.fechaDocumento'] || 'Date'}:</strong> ${formatDateForPDF(document.fechaDocumento)}</span>
      </div>

      <!-- Line items table -->
      <table>
        <thead>
          <tr>
            <th style="width: 45%">${translations['form.descripcion'] || 'Description'}</th>
            <th class="center" style="width: 15%">${translations['form.cantidad'] || 'Quantity'}</th>
            <th class="right" style="width: 18%">${translations['form.precio'] || 'Unit Price'}</th>
            <th class="right" style="width: 22%">${translations['form.importe'] || 'Amount'}</th>
          </tr>
        </thead>
        <tbody>
          ${lineasHTML}
        </tbody>
      </table>

      <!-- Tax note if reverse charge -->
      ${tax.reverseCharge ? `<div class="tax-note">${translations['iva.inversionNota'] || 'Reverse charge - Tax 0%'}</div>` : ''}

      <!-- Footer: Payment and totals -->
      <div class="footer">
        <div class="payment-info">
          <div class="payment-title">${translations['payment.metodoPago'] || 'Payment Method'}</div>
          <div class="payment-detail">${business.paymentMethod}</div>
          <div class="payment-detail"><strong>IBAN:</strong> ${business.paymentDetails}</div>
        </div>
        <div class="totals">
          <div class="total-row">
            <span>${translations['totals.base'] || 'Subtotal'}</span>
            <span>${formatCurrency(calculations.baseImponible, currency)}</span>
          </div>
          <div class="total-row">
            <span>${tax.taxName} (${tax.taxRate}%)</span>
            <span>${formatCurrency(calculations.importeTax, currency)}</span>
          </div>
          <div class="total-row total-final">
            <span>${translations['totals.total'] || 'TOTAL'}</span>
            <span>${formatCurrency(calculations.total, currency)}</span>
          </div>
        </div>
      </div>

      <!-- Comments (after totals) -->
      ${document.comentarios ? `
        <div class="comments-section">
          <div class="comments-title">${translations['comments.title'] || 'Comments'}</div>
          <div class="comments-text">${document.comentarios.replace(/\n/g, '<br>')}</div>
        </div>
      ` : ''}

      <!-- Legal footer -->
      <div class="legal-footer">
        ${business.companyName} · ${business.address} · ${business.postalCode} ${business.city} · ${business.taxIdLabel}: ${business.taxId}
      </div>
    </body>
    </html>
  `;
};
