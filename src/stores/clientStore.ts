// src/stores/clientStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Client, ClientFormData } from '../types/client';
import { generateSecureId } from '../utils/idGenerator';

interface ClientStore {
  clients: Client[];
  
  // Actions
  addClient: (client: ClientFormData) => Client;
  updateClient: (id: string, data: Partial<ClientFormData>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  searchClients: (query: string) => Client[];
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      
      addClient: (clientData: ClientFormData): Client => {
        const now = new Date().toISOString();
        const newClient: Client = {
          ...clientData,
          id: generateSecureId(),
          createdAt: now,
          updatedAt: now,
        };
        
        set(state => ({
          clients: [...state.clients, newClient],
        }));
        
        return newClient;
      },
      
      updateClient: (id: string, data: Partial<ClientFormData>): void => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === id
              ? { ...client, ...data, updatedAt: new Date().toISOString() }
              : client
          ),
        }));
      },
      
      deleteClient: (id: string): void => {
        set(state => ({
          clients: state.clients.filter(client => client.id !== id),
        }));
      },
      
      getClientById: (id: string): Client | undefined => {
        return get().clients.find(client => client.id === id);
      },
      
      searchClients: (query: string): Client[] => {
        const lowerQuery = query.toLowerCase();
        return get().clients.filter(
          client =>
            client.nombre.toLowerCase().includes(lowerQuery) ||
            client.nifCif.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'en-ascuas-clients',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);