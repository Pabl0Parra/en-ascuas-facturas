// src/services/pdfTemplates/modern.ts
import type { PdfTemplateContext } from '../../types/pdfTemplate';
import { formatCurrency } from '../../utils/currencyFormatter';

/**
 * Modern PDF template - Contemporary design with bold typography
 *
 * Features: Accent color sidebar, large typography, card-like sections
 */
export const modernTemplate = (context: PdfTemplateContext): string => {
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
        <td class="desc-cell"><strong>${linea.descripcion}</strong></td>
        <td class="center">${linea.cantidad}</td>
        <td class="right">${formatCurrency(linea.precioUnitario, currency)}</td>
        <td class="right strong">${formatCurrency(linea.importe, currency)}</td>
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
          font-family: 'Helvetica Neue', 'Segoe UI', Arial, sans-serif;
          font-size: 12px;
          color: #2d3748;
          padding: 0;
          max-width: 210mm;
          line-height: 1.6;
        }

        /* Layout with sidebar */
        .container {
          display: flex;
          min-height: 297mm;
        }
        .sidebar {
          width: 60px;
          background: ${primaryColor};
          flex-shrink: 0;
        }
        .content {
          flex: 1;
          padding: 30px 40px;
        }

        /* Header */
        .header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid ${primaryColor};
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo-img {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        .company-name {
          font-size: 28px;
          font-weight: 900;
          color: #1a202c;
          letter-spacing: -0.5px;
        }
        .doc-badge {
          background: ${primaryColor};
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-align: center;
        }
        .doc-label {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .doc-number {
          font-size: 24px;
          font-weight: 900;
          margin-top: 5px;
        }

        /* Data cards */
        .data-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .data-card {
          flex: 1;
          background: #f7fafc;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid ${primaryColor};
        }
        .card-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: ${primaryColor};
          margin-bottom: 12px;
        }
        .card-line {
          margin-bottom: 5px;
          font-size: 12px;
          color: #4a5568;
        }
        .card-line.name {
          font-size: 16px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        /* Date banner */
        .date-banner {
          background: #1a202c;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 13px;
          font-weight: 600;
        }

        /* Table */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
          border-radius: 8px;
          overflow: hidden;
        }
        thead {
          background: ${primaryColor};
          color: white;
        }
        th {
          padding: 15px 12px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        th.center { text-align: center; }
        th.right { text-align: right; }
        td {
          padding: 15px 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 12px;
        }
        td.center { text-align: center; }
        td.right { text-align: right; }
        td.strong { font-weight: 700; color: #1a202c; }
        tbody tr:hover {
          background: #f7fafc;
        }

        /* Tax note */
        .tax-note {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 11px;
          color: #856404;
        }

        /* Totals section */
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 30px;
        }
        .totals-box {
          width: 50%;
          background: #f7fafc;
          border-radius: 12px;
          padding: 20px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 13px;
          border-bottom: 1px solid #e2e8f0;
        }
        .total-row.final {
          border: none;
          background: ${primaryColor};
          color: white;
          font-size: 20px;
          font-weight: 900;
          padding: 15px 20px;
          border-radius: 8px;
          margin-top: 10px;
        }

        /* Payment info */
        .payment-section {
          margin-top: 30px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 12px;
          border-left: 4px solid ${primaryColor};
        }
        .payment-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: ${primaryColor};
          margin-bottom: 12px;
        }
        .payment-line {
          font-size: 12px;
          margin-bottom: 5px;
        }

        /* Comments */
        .comments-section {
          margin-top: 30px;
          padding: 20px;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
        }
        .comments-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: ${primaryColor};
          margin-bottom: 12px;
        }
        .comments-text {
          font-size: 11px;
          color: #4a5568;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        /* Footer */
        .legal-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          font-size: 9px;
          color: #a0aec0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="sidebar"></div>
        <div class="content">
          <!-- Header -->
          <div class="header">
            <div class="header-top">
              <div class="logo-section">
                ${logoBase64 ? `<img src="${logoBase64}" class="logo-img" />` : ''}
                <div class="company-name">${business.companyName}</div>
              </div>
              <div class="doc-badge">
                <div class="doc-label">${docLabel}</div>
                ${document.numeroDocumento ? `<div class="doc-number">${document.numeroDocumento}</div>` : ''}
              </div>
            </div>
          </div>

          <!-- Data cards -->
          <div class="data-row">
            <div class="data-card">
              <div class="card-title">${translations['document.datosEmpresa'] || 'From'}</div>
              <div class="card-line name">${business.companyName}</div>
              <div class="card-line">${business.address}</div>
              <div class="card-line">${business.postalCode} ${business.city}</div>
              <div class="card-line">${business.taxIdLabel}: ${business.taxId}</div>
            </div>
            <div class="data-card">
              <div class="card-title">${translations['document.datosFacturacion'] || 'To'}</div>
              <div class="card-line name">${client.nombre}</div>
              <div class="card-line">${client.direccion}</div>
              <div class="card-line">${client.codigoPostal} ${client.ciudad}</div>
              <div class="card-line">${business.taxIdLabel}: ${client.nifCif}</div>
            </div>
          </div>

          <!-- Date -->
          <div class="date-banner">
            ${translations['document.fechaDocumento'] || 'Date'}: ${formatDateForPDF(document.fechaDocumento)}
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

          ${tax.reverseCharge ? `<div class="tax-note">${translations['iva.inversionNota'] || 'Reverse charge'}</div>` : ''}

          <!-- Totals -->
          <div class="totals-section">
            <div class="totals-box">
              <div class="total-row">
                <span>${translations['totals.base'] || 'Subtotal'}</span>
                <span>${formatCurrency(calculations.baseImponible, currency)}</span>
              </div>
              <div class="total-row">
                <span>${tax.taxName} (${tax.taxRate}%)</span>
                <span>${formatCurrency(calculations.importeTax, currency)}</span>
              </div>
              <div class="total-row final">
                <span>${translations['totals.total'] || 'TOTAL'}</span>
                <span>${formatCurrency(calculations.total, currency)}</span>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="payment-section">
            <div class="payment-title">${translations['payment.metodoPago'] || 'Payment'}</div>
            <div class="payment-line"><strong>${business.paymentMethod}</strong></div>
            <div class="payment-line">IBAN: ${business.paymentDetails}</div>
          </div>

          ${document.comentarios ? `
            <div class="comments-section">
              <div class="comments-title">${translations['comments.title'] || 'Notes'}</div>
              <div class="comments-text">${document.comentarios.replace(/\n/g, '<br>')}</div>
            </div>
          ` : ''}

          <div class="legal-footer">
            ${business.companyName} · ${business.taxIdLabel}: ${business.taxId}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
