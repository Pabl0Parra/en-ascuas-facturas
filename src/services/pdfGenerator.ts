import * as Print from 'expo-print';
import type { DocumentData } from '../types/document';
import { COMPANY } from '../constants/company';
import { LOGO_BASE64 } from '../constants/logo';

const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateForPDF = (dateString: string): string => {
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString.replaceAll('-', '/');
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

export const generateInvoiceHTML = (data: DocumentData): string => {
  const isPresupuesto = data.tipo === 'presupuesto';
  const docLabel = isPresupuesto ? 'PRESUPUESTO' : 'FACTURA';

  const lineasHTML = data.lineas
    .map(
      (linea) => `
      <tr>
        <td class="desc-cell">${linea.descripcion}</td>
        <td class="center">${linea.cantidad}</td>
        <td class="right">${formatCurrency(linea.precioUnitario)} €</td>
        <td class="right">${formatCurrency(linea.importe)} €</td>
      </tr>
    `,
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
        
        /* Header con logo */
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #FF4500;
        }
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo-img {
          width: 70px;
          height: 70px;
        }
        .company-name {
          font-size: 24px;
          font-weight: 900;
          color: #1a1a1a;
          letter-spacing: 2px;
        }
        .company-tagline {
          font-size: 12px;
          color: #E25822;
          letter-spacing: 1px;
          font-weight: 300;
        }
        .doc-type {
          text-align: right;
        }
        .doc-type-label {
          font-size: 22px;
          font-weight: bold;
          color: #FF4500;
        }
        .doc-number {
          font-size: 14px;
          color: #333;
          margin-top: 5px;
        }
        
        /* Datos section */
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
          color: #FF4500;
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
        
        /* Info documento */
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
        
        /* Tabla */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        th {
          background: #FF4500;
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
        
        /* Nota IVA */
        .iva-note {
          padding: 10px 15px;
          font-style: italic;
          color: #666;
          background: #fff3cd;
          border-left: 3px solid #ffc107;
          margin-bottom: 15px;
          font-size: 10px;
        }
        
        /* Observaciones */
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
          color: #FF4500;
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
          color: #FF4500;
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
          background: #FF4500;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          margin-top: 8px;
        }
        
        /* Footer legal */
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
      <!-- Header con logo -->
      <div class="header-top">
        <div class="logo-section">
          <img src="data:image/png;base64,${LOGO_BASE64}" class="logo-img" />
          <div>
            <div class="company-name">EN ASCUAS</div>
          </div>
        </div>
        <div class="doc-type">
          <div class="doc-type-label">${docLabel}</div>
          ${data.numeroDocumento
      ? `<div class="doc-number">Nº ${data.numeroDocumento}</div>`
      : ''
    }
        </div>
      </div>
      
      <!-- Datos empresa y cliente -->
      <div class="datos-container">
        <div class="datos-section">
          <div class="datos-title">Datos Emisor</div>
          <div class="datos-row name">${COMPANY.nombre}</div>
          <div class="datos-row">${COMPANY.direccion}</div>
          <div class="datos-row">${COMPANY.codigoPostal} ${COMPANY.ciudad}</div>
          <div class="datos-row">${COMPANY.provincia}</div>
          <div class="datos-row">NIF: ${COMPANY.nif}</div>
        </div>
        <div class="datos-section">
          <div class="datos-title">Datos Cliente</div>
          <div class="datos-row name">${data.clienteNombre}</div>
          <div class="datos-row">${data.clienteDireccion}</div>
          <div class="datos-row">${data.clienteCodigoPostal} ${data.clienteCiudad
    }</div>
          <div class="datos-row">${data.clienteProvincia}</div>
          <div class="datos-row">NIF/CIF: ${data.clienteNifCif}</div>
        </div>
      </div>
      
      <!-- Info documento -->
      <div class="doc-info">
        <span><strong>Fecha:</strong> ${formatDateForPDF(
      data.fechaDocumento,
    )}</span>
      </div>
      
      <!-- Tabla de líneas -->
      <table>
        <thead>
          <tr>
            <th style="width: 45%">Descripción</th>
            <th class="center" style="width: 15%">Cantidad</th>
            <th class="right" style="width: 18%">Precio Unit.</th>
            <th class="right" style="width: 22%">Importe</th>
          </tr>
        </thead>
        <tbody>
          ${lineasHTML}
        </tbody>
      </table>
      
      <!-- Nota IVA si aplica -->
      ${data.tipoIVA === 0
      ? '<div class="iva-note">Operación sujeta a inversión del sujeto pasivo - IVA 0%</div>'
      : ''
    }
      
      <!-- Footer: Pago y totales -->
      <div class="footer">
        <div class="payment-info">
          <div class="payment-title">Forma de Pago</div>
          <div class="payment-detail">${COMPANY.metodoPago}</div>
          <div class="payment-detail"><strong>IBAN:</strong> ${COMPANY.iban
    }</div>
        </div>
        <div class="totals">
          <div class="total-row">
            <span>Base Imponible</span>
            <span>${formatCurrency(data.baseImponible)} €</span>
          </div>
          <div class="total-row">
            <span>IVA (${data.tipoIVA}%)</span>
            <span>${formatCurrency(data.importeIVA)} €</span>
          </div>
          <div class="total-row total-final">
            <span>TOTAL</span>
            <span>${formatCurrency(data.total)} €</span>
          </div>
        </div>
      </div>
      
      <!-- Observaciones (después del total) -->
      ${data.comentarios
      ? `
        <div class="comments-section">
          <div class="comments-title">Observaciones</div>
          <div class="comments-text">${data.comentarios.replaceAll(
        '\n',
        '<br>',
      )}</div>
        </div>
      `
      : ''
    }
      
      <!-- Footer legal -->
      <div class="legal-footer">
        ${COMPANY.nombre} · ${COMPANY.direccion} · ${COMPANY.codigoPostal} ${COMPANY.ciudad
    } · NIF: ${COMPANY.nif}
      </div>
    </body>
    </html>
  `;
};

export const createPDF = async (data: DocumentData): Promise<string> => {
  const html = generateInvoiceHTML(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return uri;
};