import React, { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Changed import
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/ui/Header';
import { ClientCard } from '../../src/components/cliente/ClientCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useClientStore } from '../../src/stores/clientStore';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOWS,
} from '../../src/constants/theme';
import { STRINGS } from '../../src/constants/strings';

export default function ClientesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const clients = useClientStore((state) => state.clients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const searchClients = useClientStore((state) => state.searchClients);

  const displayedClients = searchQuery ? searchClients(searchQuery) : clients;

  const handleNewClient = () => {
    router.push('/cliente/nuevo');
  };

  const handleEditClient = (id: string) => {
    router.push(`/cliente/${id}`);
  };

  const handleDeleteClient = (id: string, nombre: string) => {
    Alert.alert(
      'Eliminar Cliente',
      `¿Estás seguro de que quieres eliminar a "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteClient(id),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={STRINGS.navigation.clientes} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar cliente..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Client List */}
      <FlatList
        data={displayedClients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ClientCard
            client={item}
            onPress={() => handleEditClient(item.id)}
            onEdit={() => handleEditClient(item.id)}
            onDelete={() => handleDeleteClient(item.id, item.nombre)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title={STRINGS.empty.clientes}
            description="Añade un cliente para empezar a crear documentos"
            actionLabel={STRINGS.actions.nuevoCliente}
            onAction={handleNewClient}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewClient}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLORS.textInverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: SPACING.md,
    paddingTop: SPACING.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
