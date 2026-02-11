import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/ui/Header';
import { ClientCard } from '../../src/components/cliente/ClientCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useClientStore } from '../../src/stores/clientStore';
import { useTheme } from '../../src/hooks/useTheme';
import type { ClientTag, ClientSortBy, ClientFilters } from '../../src/types/client';
import type { AppColors } from '../../src/constants/theme';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
  SHADOWS,
} from '../../src/constants/theme';
import { STRINGS } from '../../src/constants/strings';
import { SwipeableTabScreen } from '../../src/components/ui/SwipeableTabScreen';

const SORT_OPTIONS: Array<{ value: ClientSortBy; label: string }> = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'createdAt', label: 'Date Added' },
  { value: 'updatedAt', label: 'Recently Updated' },
];

export default function ClientesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<ClientTag[]>([]);
  const [sortBy, setSortBy] = useState<ClientSortBy>('name');
  const [showFilters, setShowFilters] = useState(false);

  const TAG_LABELS: Record<ClientTag, { label: string; color: string }> = useMemo(() => ({
    regular: { label: 'Regular', color: colors.primary },
    vip: { label: 'VIP', color: '#8B5CF6' },
    new: { label: 'New', color: '#10B981' },
    inactive: { label: 'Inactive', color: '#6B7280' },
    international: { label: 'International', color: '#3B82F6' },
    domestic: { label: 'Domestic', color: '#F59E0B' },
  }), [colors]);

  const clients = useClientStore((state) => state.clients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const getFilteredClients = useClientStore((state) => state.getFilteredClients);
  const getSortedClients = useClientStore((state) => state.getSortedClients);

  // Apply filters and sorting
  const displayedClients = useMemo(() => {
    const filters: ClientFilters = {
      searchQuery: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    };

    const filtered = getFilteredClients(filters);

    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nombre.localeCompare(b.nombre);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });
  }, [clients, searchQuery, selectedTags, sortBy, getFilteredClients]);

  const toggleTag = (tag: ClientTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

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
      ]
    );
  };

  const activeFilterCount = selectedTags.length + (searchQuery ? 1 : 0);

  return (
    <SwipeableTabScreen>
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={STRINGS.navigation.clientes} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar cliente..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter and Sort Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name="filter"
              size={18}
              color={showFilters ? colors.primary : colors.textSecondary}
            />
            <Text style={[
              styles.filterButtonText,
              showFilters && styles.filterButtonTextActive,
            ]}>
              Filters
            </Text>
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.sortContainer}>
            <Ionicons name="swap-vertical" size={18} color={colors.textSecondary} />
            <Text style={styles.sortLabel}>Sort:</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSortBy(option.value)}
                style={[
                  styles.sortOption,
                  sortBy === option.value && styles.sortOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <View style={styles.filterPanel}>
            <View style={styles.filterPanelHeader}>
              <Text style={styles.filterPanelTitle}>Filter by Tags</Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={styles.clearFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScrollContent}
            >
              {(Object.entries(TAG_LABELS) as Array<[ClientTag, typeof TAG_LABELS[ClientTag]]>).map(
                ([tag, { label, color }]) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tagChip,
                        isSelected && { backgroundColor: color + '20', borderColor: color },
                      ]}
                      onPress={() => toggleTag(tag)}
                    >
                      <Text
                        style={[
                          styles.tagChipText,
                          isSelected && { color, fontWeight: '600' },
                        ]}
                      >
                        {label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={16} color={color} />
                      )}
                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Results Count */}
      {(searchQuery || selectedTags.length > 0) && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {displayedClients.length} {displayedClients.length === 1 ? 'client' : 'clients'} found
          </Text>
        </View>
      )}

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
            title={
              searchQuery || selectedTags.length > 0
                ? 'No clients found'
                : STRINGS.empty.clientes
            }
            description={
              searchQuery || selectedTags.length > 0
                ? 'Try adjusting your filters or search query'
                : 'Añade un cliente para empezar a crear documentos'
            }
            actionLabel={
              searchQuery || selectedTags.length > 0
                ? 'Clear Filters'
                : STRINGS.actions.nuevoCliente
            }
            onAction={
              searchQuery || selectedTags.length > 0
                ? clearFilters
                : handleNewClient
            }
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewClient}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.textInverse} />
      </TouchableOpacity>
    </SafeAreaView>
    </SwipeableTabScreen>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    paddingVertical: SPACING.xs,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: colors.surface,
    gap: SPACING.xs,
  },
  filterButtonActive: {
    backgroundColor: colors.primary + '15',
  },
  filterButtonText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.primary,
  },
  filterBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textInverse,
  },
  sortContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sortLabel: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortOption: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  sortOptionActive: {
    backgroundColor: colors.primary + '15',
    borderRadius: BORDER_RADIUS.sm,
  },
  sortOptionText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
  },
  sortOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  filterPanel: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  filterPanelTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  clearFiltersText: {
    fontSize: FONT_SIZE.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  tagsScrollContent: {
    gap: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: SPACING.xs,
  },
  tagChipText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  resultsBar: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: colors.surface,
  },
  resultsText: {
    fontSize: FONT_SIZE.xs,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xs,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
});
