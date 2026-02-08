// src/services/pdfTemplates/minimal.ts
import type { PdfTemplateContext } from '../../types/pdfTemplate';
import { formatCurrency } from '../../utils/currencyFormatter';

/**
 * Minimal PDF template - Clean and simple with lots of whitespace
 *
 * Features: Monochrome with subtle accents, lots of breathing room, elegant simplicity
 */
export const minimalTemplate = (context: PdfTemplateContext): string => {
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

  const docLabel = translations['document.' + document.tipo] || document.tipo.toUpperCase();

  const formatDateForPDF = (dateString: string): string => {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString.replace(/-/g, '/');
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const lineasHTML = lineItems
    .map(
      (linea) => `
      <tr>
        <td>${linea.descripcion}</td>
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
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 11px;
          color: #333;
          padding: 40px 50px;
          max-width: 210mm;
          line-height: 1.8;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 60px;
          padding-bottom: 30px;
          border-bottom: 1px solid #ddd;
        }
        .logo-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 15px;
        }
        .company-name {
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 20px;
        }
        .doc-label {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 2px;
          color: #666;
          margin-bottom: 5px;
        }
        .doc-number {
          font-size: 20px;
          font-weight: 300;
          color: #1a1a1a;
        }

        /* Data sections */
        .data-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
          gap: 40px;
        }
        .data-section {
          flex: 1;
        }
        .section-title {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #999;
          margin-bottom: 15px;
        }
        .data-line {
          margin-bottom: 6px;
          font-size: 11px;
          color: #555;
        }
        .data-line.name {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        /* Date */
        .date-section {
          text-align: right;
          margin-bottom: 40px;
          font-size: 11px;
          color: #666;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 40px 0;
        }
        thead {
          border-bottom: 2px solid #1a1a1a;
        }
        th {
          padding: 15px 0;
          text-align: left;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #1a1a1a;
        }
        th.center { text-align: center; }
        th.right { text-align: right; }
        td {
          padding: 20px 0;
          border-bottom: 1px solid #eee;
          font-size: 11px;
          color: #555;
        }
        td.center { text-align: center; }
        td.right { text-align: right; }
        tbody tr:last-child td {
          border-bottom: 2px solid #ddd;
        }

        /* Tax note */
        .tax-note {
          margin: 30px 0;
          padding: 20px;
          border-left: 2px solid ${primaryColor};
          background: #fafafa;
          font-size: 10px;
          color: #666;
          font-style: italic;
        }

        /* Totals */
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin: 50px 0;
        }
        .totals-box {
          width: 45%;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 12px;
          color: #555;
        }
        .total-row.subtotal {
          border-bottom: 1px solid #eee;
        }
        .total-row.final {
          border-top: 2px solid #1a1a1a;
          padding: 20px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 10px;
        }
        .total-row.final .amount {
          color: ${primaryColor};
        }

        /* Payment */
        .payment-section {
          margin: 50px 0;
        }
        .payment-title {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #999;
          margin-bottom: 15px;
        }
        .payment-line {
          font-size: 11px;
          margin-bottom: 5px;
          color: #555;
        }

        /* Comments */
        .comments-section {
          margin: 50px 0;
          padding: 20px 0;
          border-top: 1px solid #eee;
        }
        .comments-title {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #999;
          margin-bottom: 15px;
        }
        .comments-text {
          font-size: 10px;
          color: #666;
          line-height: 1.9;
          white-space: pre-wrap;
        }

        /* Footer */
        .legal-footer {
          margin-top: 60px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 8px;
          color: #aaa;
          letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" />` : ''}
        <div class="company-name">${business.companyName}</div>
        <div class="doc-label">${docLabel}</div>
        ${document.numeroDocumento ? `<div class="doc-number">${document.numeroDocumento}</div>` : ''}
      </div>

      <!-- Data sections -->
      <div class="data-row">
        <div class="data-section">
          <div class="section-title">${translations['document.datosEmpresa'] || 'From'}</div>
          <div class="data-line name">${business.companyName}</div>
          <div class="data-line">${business.address}</div>
          <div class="data-line">${business.postalCode} ${business.city}, ${business.region}</div>
          <div class="data-line">${business.taxIdLabel}: ${business.taxId}</div>
        </div>
        <div class="data-section">
          <div class="section-title">${translations['document.datosFacturacion'] || 'To'}</div>
          <div class="data-line name">${client.nombre}</div>
          <div class="data-line">${client.direccion}</div>
          <div class="data-line">${client.codigoPostal} ${client.ciudad}, ${client.provincia}</div>
          <div class="data-line">${business.taxIdLabel}: ${client.nifCif}</div>
        </div>
      </div>

      <!-- Date -->
      <div class="date-section">
        ${formatDateForPDF(document.fechaDocumento)}
      </div>

      <!-- Items table -->
      <table>
        <thead>
          <tr>
            <th style="width: 45%">${translations['form.descripcion'] || 'Description'}</th>
            <th class="center" style="width: 15%">${translations['form.cantidad'] || 'Qty'}</th>
            <th class="right" style="width: 18%">${translations['form.precio'] || 'Price'}</th>
            <th class="right" style="width: 22%">${translations['form.importe'] || 'Amount'}</th>
          </tr>
        </thead>
        <tbody>
          ${lineasHTML}
        </tbody>
      </table>

      ${tax.reverseCharge ? `<div class="tax-note">${translations['iva.inversionNota'] || 'Reverse charge applicable'}</div>` : ''}

      <!-- Totals -->
      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row subtotal">
            <span>${translations['totals.base'] || 'Subtotal'}</span>
            <span>${formatCurrency(calculations.baseImponible, currency)}</span>
          </div>
          <div class="total-row">
            <span>${tax.taxName} (${tax.taxRate}%)</span>
            <span>${formatCurrency(calculations.importeTax, currency)}</span>
          </div>
          <div class="total-row final">
            <span>${translations['totals.total'] || 'Total'}</span>
            <span class="amount">${formatCurrency(calculations.total, currency)}</span>
          </div>
        </div>
      </div>

      <!-- Payment -->
      <div class="payment-section">
        <div class="payment-title">${translations['payment.metodoPago'] || 'Payment'}</div>
        <div class="payment-line">${business.paymentMethod}</div>
        <div class="payment-line">${business.paymentDetails}</div>
      </div>

      ${document.comentarios ? `
        <div class="comments-section">
          <div class="comments-title">${translations['comments.title'] || 'Notes'}</div>
          <div class="comments-text">${document.comentarios.replace(/\n/g, '<br>')}</div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div class="legal-footer">
        ${business.companyName} · ${business.taxIdLabel}: ${business.taxId}
      </div>
    </body>
    </html>
  `;
};
