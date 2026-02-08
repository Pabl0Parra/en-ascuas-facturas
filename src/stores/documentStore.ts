// src/stores/documentStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DocumentMetadata, DocumentType, DocumentStatus } from '../types/document';
import { generateSecureId } from '../utils/idGenerator';

interface DocumentStore {
  documents: DocumentMetadata[];

  // Actions
  addDocument: (metadata: Omit<DocumentMetadata, 'id' | 'createdAt'>) => DocumentMetadata;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentMetadata | undefined;
  getDocumentsByType: (tipo: DocumentType) => DocumentMetadata[];
  getAllDocumentNumbers: () => string[];

  // Phase 3.5: Status management
  updateDocumentStatus: (id: string, status: DocumentStatus) => void;
  markAsPaid: (id: string, paymentMethod?: string) => void;
  getDocumentsByStatus: (status: DocumentStatus) => DocumentMetadata[];
  getOverdueDocuments: () => DocumentMetadata[];

  // Bulk operations
  clearAll: () => void;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: [],
      
      addDocument: (metadata: Omit<DocumentMetadata, 'id' | 'createdAt'>): DocumentMetadata => {
        const newDocument: DocumentMetadata = {
          ...metadata,
          id: generateSecureId(),
          createdAt: new Date().toISOString(),
        };
        
        set(state => ({
          documents: [newDocument, ...state.documents], // Newest first
        }));
        
        return newDocument;
      },
      
      deleteDocument: (id: string): void => {
        set(state => ({
          documents: state.documents.filter(doc => doc.id !== id),
        }));
      },
      
      getDocumentById: (id: string): DocumentMetadata | undefined => {
        return get().documents.find(doc => doc.id === id);
      },
      
      getDocumentsByType: (tipo: DocumentType): DocumentMetadata[] => {
        return get().documents
          .filter(doc => doc.tipo === tipo)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      
      getAllDocumentNumbers: (): string[] => {
        return get().documents.map(doc => doc.numeroDocumento);
      },

      // Phase 3.5: Status management
      updateDocumentStatus: (id: string, status: DocumentStatus): void => {
        set(state => ({
          documents: state.documents.map(doc =>
            doc.id === id ? { ...doc, status } : doc
          ),
        }));
      },

      markAsPaid: (id: string, paymentMethod?: string): void => {
        set(state => ({
          documents: state.documents.map(doc =>
            doc.id === id
              ? {
                  ...doc,
                  status: 'paid' as DocumentStatus,
                  paidAt: new Date().toISOString(),
                  paymentMethod: paymentMethod || 'Not specified',
                }
              : doc
          ),
        }));
      },

      getDocumentsByStatus: (status: DocumentStatus): DocumentMetadata[] => {
        return get().documents.filter(doc => (doc.status || 'sent') === status);
      },

      getOverdueDocuments: (): DocumentMetadata[] => {
        const now = new Date();

        return get().documents.filter(doc => {
          // Only invoices can be overdue
          if (doc.tipo !== 'factura') return false;

          // Already paid or cancelled
          if (doc.status === 'paid' || doc.status === 'cancelled') return false;

          // No due date set
          if (!doc.dueDate) return false;

          try {
            // Parse due date (dd-MM-yyyy format)
            const [day, month, year] = doc.dueDate.split('-').map(Number);
            const dueDate = new Date(year, month - 1, day);

            // Check if overdue
            return dueDate < now;
          } catch (error) {
            console.warn(`Failed to parse due date: ${doc.dueDate}`, error);
            return false;
          }
        });
      },

      // Clear all documents
      clearAll: (): void => {
        set({ documents: [] });
      },
    }),
    {
      name: 'en-ascuas-documents',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);