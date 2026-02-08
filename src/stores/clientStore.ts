// src/stores/clientStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Client,
  ClientFormData,
  ClientTag,
  ClientFilters,
  ClientSortBy,
  ClientStats,
} from '../types/client';
import { generateSecureId } from '../utils/idGenerator';

interface ClientStore {
  clients: Client[];

  // CRUD Actions
  addClient: (client: ClientFormData) => Client;
  updateClient: (id: string, data: Partial<ClientFormData>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Search & Filter
  searchClients: (query: string) => Client[];
  getFilteredClients: (filters: ClientFilters) => Client[];

  // Tags
  addTagToClient: (clientId: string, tag: ClientTag) => void;
  removeTagFromClient: (clientId: string, tag: ClientTag) => void;
  getClientsByTag: (tag: ClientTag) => Client[];

  // Sorting
  getSortedClients: (sortBy: ClientSortBy, ascending?: boolean) => Client[];

  // Statistics (requires documentStore, calculated dynamically)
  getClientStats: (clientId: string) => ClientStats;

  // Bulk operations
  clearAll: () => void;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],

      // Add new client
      addClient: (clientData: ClientFormData): Client => {
        const now = new Date().toISOString();
        const newClient: Client = {
          ...clientData,
          id: generateSecureId(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          clients: [...state.clients, newClient],
        }));

        return newClient;
      },

      // Update client
      updateClient: (id: string, data: Partial<ClientFormData>): void => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? { ...client, ...data, updatedAt: new Date().toISOString() }
              : client
          ),
        }));
      },

      // Delete client
      deleteClient: (id: string): void => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      // Get client by ID
      getClientById: (id: string): Client | undefined => {
        return get().clients.find((client) => client.id === id);
      },

      // Search clients (by name or tax ID)
      searchClients: (query: string): Client[] => {
        const lowerQuery = query.toLowerCase();
        return get().clients.filter(
          (client) =>
            client.nombre.toLowerCase().includes(lowerQuery) ||
            client.nifCif.toLowerCase().includes(lowerQuery) ||
            (client.email?.toLowerCase().includes(lowerQuery) ?? false)
        );
      },

      // Get filtered clients
      getFilteredClients: (filters: ClientFilters): Client[] => {
        let filtered = [...get().clients];

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter((client) =>
            filters.tags!.some((tag) => client.tags?.includes(tag))
          );
        }

        // Filter by search query
        if (filters.searchQuery) {
          const lowerQuery = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (client) =>
              client.nombre.toLowerCase().includes(lowerQuery) ||
              client.nifCif.toLowerCase().includes(lowerQuery) ||
              (client.email?.toLowerCase().includes(lowerQuery) ?? false)
          );
        }

        // Filter by has email
        if (filters.hasEmail !== undefined) {
          filtered = filtered.filter((client) =>
            filters.hasEmail
              ? client.email && client.email.length > 0
              : !client.email || client.email.length === 0
          );
        }

        // Filter by created date
        if (filters.createdAfter) {
          filtered = filtered.filter(
            (client) => client.createdAt >= filters.createdAfter!
          );
        }

        if (filters.createdBefore) {
          filtered = filtered.filter(
            (client) => client.createdAt <= filters.createdBefore!
          );
        }

        return filtered;
      },

      // Add tag to client
      addTagToClient: (clientId: string, tag: ClientTag): void => {
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id === clientId) {
              const currentTags = client.tags || [];
              if (!currentTags.includes(tag)) {
                return {
                  ...client,
                  tags: [...currentTags, tag],
                  updatedAt: new Date().toISOString(),
                };
              }
            }
            return client;
          }),
        }));
      },

      // Remove tag from client
      removeTagFromClient: (clientId: string, tag: ClientTag): void => {
        set((state) => ({
          clients: state.clients.map((client) => {
            if (client.id === clientId && client.tags) {
              return {
                ...client,
                tags: client.tags.filter((t) => t !== tag),
                updatedAt: new Date().toISOString(),
              };
            }
            return client;
          }),
        }));
      },

      // Get clients by tag
      getClientsByTag: (tag: ClientTag): Client[] => {
        return get().clients.filter((client) => client.tags?.includes(tag));
      },

      // Get sorted clients
      getSortedClients: (
        sortBy: ClientSortBy,
        ascending: boolean = true
      ): Client[] => {
        const clients = [...get().clients];

        clients.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case 'name':
              comparison = a.nombre.localeCompare(b.nombre);
              break;

            case 'createdAt':
              comparison =
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime();
              break;

            case 'updatedAt':
              comparison =
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime();
              break;

            case 'totalInvoiced':
              // For this, we need document data which we don't have here
              // This would be calculated on-demand in the UI
              comparison = 0;
              break;
          }

          return ascending ? comparison : -comparison;
        });

        return clients;
      },

      // Get client statistics
      // Note: This would need to access documentStore, which creates a circular dependency
      // Better to calculate this in a separate service or in the UI component
      getClientStats: (clientId: string): ClientStats => {
        // This is a placeholder - statistics should be calculated using document data
        // In a real implementation, this would query documentStore
        return {
          totalInvoices: 0,
          totalQuotes: 0,
          totalInvoiced: 0,
          lastInvoiceDate: null,
          lastQuoteDate: null,
        };
      },

      // Clear all clients
      clearAll: (): void => {
        set({ clients: [] });
      },
    }),
    {
      name: 'en-ascuas-clients',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
