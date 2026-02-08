// src/services/dashboardService.ts

import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import { useDocumentStore } from '../stores/documentStore';
import { useRecurringStore } from '../stores/recurringStore';
import type { DocumentMetadata } from '../types/document';

/**
 * Dashboard Statistics Service
 *
 * Calculates key metrics for the home screen dashboard.
 * Provides quick insights into business performance.
 */

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  // Current month metrics
  invoicesThisMonth: number;
  quotesThisMonth: number;
  revenueThisMonth: number;

  // Year-to-date metrics
  invoicesThisYear: number;
  quotesThisYear: number;
  revenueThisYear: number;

  // All-time metrics
  totalInvoices: number;
  totalQuotes: number;
  totalRevenue: number;

  // Recent activity
  recentDocuments: DocumentMetadata[];

  // Recurring invoices
  pendingRecurringInvoices: number;

  // Overdue invoices
  overdueInvoices: number;
}

/**
 * Check if a document date falls within a date range
 */
const isDocumentInRange = (
  doc: DocumentMetadata,
  start: Date,
  end: Date
): boolean => {
  try {
    // Parse document date (format: dd-MM-yyyy)
    const [day, month, year] = doc.fechaDocumento.split('-').map(Number);
    const docDate = new Date(year, month - 1, day);

    return isWithinInterval(docDate, { start, end });
  } catch (error) {
    console.warn(`Failed to parse date: ${doc.fechaDocumento}`, error);
    return false;
  }
};

/**
 * Calculate dashboard statistics
 */
export const calculateDashboardStats = (): DashboardStats => {
  const documents = useDocumentStore.getState().documents;
  const recurringStore = useRecurringStore.getState();

  // Date ranges
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  // Filter documents by type
  const invoices = documents.filter((doc) => doc.tipo === 'factura');
  const quotes = documents.filter((doc) => doc.tipo === 'presupuesto');

  // This month metrics
  const invoicesThisMonth = invoices.filter((doc) =>
    isDocumentInRange(doc, monthStart, monthEnd)
  );
  const quotesThisMonth = quotes.filter((doc) =>
    isDocumentInRange(doc, monthStart, monthEnd)
  );
  const revenueThisMonth = invoicesThisMonth.reduce(
    (sum, doc) => sum + doc.total,
    0
  );

  // This year metrics
  const invoicesThisYear = invoices.filter((doc) =>
    isDocumentInRange(doc, yearStart, yearEnd)
  );
  const quotesThisYear = quotes.filter((doc) =>
    isDocumentInRange(doc, yearStart, yearEnd)
  );
  const revenueThisYear = invoicesThisYear.reduce(
    (sum, doc) => sum + doc.total,
    0
  );

  // All-time metrics
  const totalRevenue = invoices.reduce((sum, doc) => sum + doc.total, 0);

  // Recent documents (last 5)
  const recentDocuments = documents.slice(0, 5);

  // Pending recurring invoices
  const dueRules = recurringStore.getDueRules();
  const pendingRecurringInvoices = dueRules.filter(
    (rule) => rule.isActive
  ).length;

  // Overdue invoices
  const overdueInvoices = useDocumentStore.getState().getOverdueDocuments().length;

  return {
    invoicesThisMonth: invoicesThisMonth.length,
    quotesThisMonth: quotesThisMonth.length,
    revenueThisMonth,
    invoicesThisYear: invoicesThisYear.length,
    quotesThisYear: quotesThisYear.length,
    revenueThisYear,
    totalInvoices: invoices.length,
    totalQuotes: quotes.length,
    totalRevenue,
    recentDocuments,
    pendingRecurringInvoices,
    overdueInvoices,
  };
};

/**
 * Get monthly revenue trend (last N months)
 */
export interface MonthlyRevenue {
  month: string; // "Jan 2026"
  revenue: number;
  invoiceCount: number;
}

export const getMonthlyRevenueTrend = (months: number = 6): MonthlyRevenue[] => {
  const documents = useDocumentStore.getState().documents;
  const invoices = documents.filter((doc) => doc.tipo === 'factura');

  const trend: MonthlyRevenue[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthInvoices = invoices.filter((doc) =>
      isDocumentInRange(doc, monthStart, monthEnd)
    );

    const revenue = monthInvoices.reduce((sum, doc) => sum + doc.total, 0);

    trend.push({
      month: monthDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      revenue,
      invoiceCount: monthInvoices.length,
    });
  }

  return trend;
};

/**
 * Get top clients by revenue (last N clients)
 */
export interface TopClient {
  clientId: string;
  clientName: string;
  revenue: number;
  invoiceCount: number;
}

export const getTopClients = (limit: number = 5): TopClient[] => {
  const documents = useDocumentStore.getState().documents;
  const invoices = documents.filter((doc) => doc.tipo === 'factura');

  // Group by client
  const clientMap = new Map<string, TopClient>();

  for (const invoice of invoices) {
    const existing = clientMap.get(invoice.clienteId);

    if (existing) {
      existing.revenue += invoice.total;
      existing.invoiceCount += 1;
    } else {
      clientMap.set(invoice.clienteId, {
        clientId: invoice.clienteId,
        clientName: invoice.clienteNombre,
        revenue: invoice.total,
        invoiceCount: 1,
      });
    }
  }

  // Sort by revenue and limit
  return Array.from(clientMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

/**
 * Get quick action suggestions based on app state
 */
export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: 'new-invoice' | 'new-quote' | 'recurring' | 'from-template';
}

export const getQuickActionSuggestions = (): QuickAction[] => {
  const documents = useDocumentStore.getState().documents;
  const recurringStore = useRecurringStore.getState();

  const actions: QuickAction[] = [];

  // Always show new invoice
  actions.push({
    id: 'new-invoice',
    title: 'New Invoice',
    description: 'Create a new invoice',
    icon: 'document-text',
    action: 'new-invoice',
  });

  // Show new quote if user has created quotes before
  const hasQuotes = documents.some((doc) => doc.tipo === 'presupuesto');
  if (hasQuotes) {
    actions.push({
      id: 'new-quote',
      title: 'New Quote',
      description: 'Create a new quote',
      icon: 'document-outline',
      action: 'new-quote',
    });
  }

  // Show recurring alert if there are pending invoices
  const dueRules = recurringStore.getDueRules();
  if (dueRules.length > 0) {
    actions.push({
      id: 'recurring',
      title: 'Review Recurring',
      description: `${dueRules.length} pending recurring invoice${
        dueRules.length > 1 ? 's' : ''
      }`,
      icon: 'repeat',
      action: 'recurring',
    });
  }

  return actions;
};
