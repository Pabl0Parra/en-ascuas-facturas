// src/services/clientStatsService.ts

import { useDocumentStore } from '../stores/documentStore';
import type { ClientStats } from '../types/client';

/**
 * Client Statistics Service
 *
 * Calculates usage statistics for clients by analyzing document data.
 * Avoids circular dependencies between stores.
 */

/**
 * Calculate statistics for a specific client
 */
export const calculateClientStats = (clientId: string): ClientStats => {
  const documents = useDocumentStore.getState().documents;

  // Filter documents for this client (Phase 3.4: now using clientId!)
  const clientDocuments = documents.filter((doc) => doc.clienteId === clientId);

  // Calculate invoices and quotes
  const invoices = clientDocuments.filter((doc) => doc.tipo === 'factura');
  const quotes = clientDocuments.filter((doc) => doc.tipo === 'presupuesto');

  // Calculate total invoiced (sum of all invoices)
  const totalInvoiced = invoices.reduce((sum, doc) => sum + doc.total, 0);

  // Get last invoice date (most recent invoice)
  const lastInvoice = invoices.length > 0
    ? invoices.reduce((latest, doc) => {
        const docDate = new Date(doc.fechaDocumento);
        const latestDate = new Date(latest.fechaDocumento);
        return docDate > latestDate ? doc : latest;
      })
    : null;

  // Get last quote date (most recent quote)
  const lastQuote = quotes.length > 0
    ? quotes.reduce((latest, doc) => {
        const docDate = new Date(doc.fechaDocumento);
        const latestDate = new Date(latest.fechaDocumento);
        return docDate > latestDate ? doc : latest;
      })
    : null;

  return {
    totalInvoices: invoices.length,
    totalQuotes: quotes.length,
    totalInvoiced,
    lastInvoiceDate: lastInvoice ? lastInvoice.fechaDocumento : null,
    lastQuoteDate: lastQuote ? lastQuote.fechaDocumento : null,
  };
};

/**
 * Get statistics for all clients
 */
export const calculateAllClientStats = (): Record<string, ClientStats> => {
  const { clients } = require('../stores/clientStore').useClientStore.getState();
  const stats: Record<string, ClientStats> = {};

  for (const client of clients) {
    stats[client.id] = calculateClientStats(client.id);
  }

  return stats;
};
