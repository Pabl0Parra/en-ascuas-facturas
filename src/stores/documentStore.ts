// src/stores/documentStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DocumentMetadata, DocumentType } from '../types/document';
import { generateSecureId } from '../utils/idGenerator';

interface DocumentStore {
  documents: DocumentMetadata[];
  
  // Actions
  addDocument: (metadata: Omit<DocumentMetadata, 'id' | 'createdAt'>) => DocumentMetadata;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentMetadata | undefined;
  getDocumentsByType: (tipo: DocumentType) => DocumentMetadata[];
  getAllDocumentNumbers: () => string[];
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
    }),
    {
      name: 'en-ascuas-documents',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);