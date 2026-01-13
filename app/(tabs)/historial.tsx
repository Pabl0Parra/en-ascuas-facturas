import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Changed import
import { Header } from '../../src/components/ui/Header';
import { DocumentCard } from '../../src/components/historial/DocumentCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useDocumentStore } from '../../src/stores/documentStore';
import {
  sharePDF,
  deletePDF,
  doesPDFExist,
} from '../../src/services/fileService';
import { COLORS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { STRINGS } from '../../src/constants/strings';
import type { DocumentMetadata } from '../../src/types/document';

type FilterType = 'todos' | 'factura' | 'presupuesto';

export default function HistorialScreen() {
  const [filter, setFilter] = useState<FilterType>('todos');

  const documents = useDocumentStore((state) => state.documents);
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);

  const filteredDocuments =
    filter === 'todos'
      ? documents
      : documents.filter((doc) => doc.tipo === filter);

  const handleDocumentPress = async (doc: DocumentMetadata) => {
    try {
      const exists = await doesPDFExist(doc.pdfFileName);

      if (!exists) {
        Alert.alert(
          'Documento no encontrado',
          'El archivo PDF no está disponible. ¿Deseas eliminarlo del historial?',
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Eliminar',
              style: 'destructive',
              onPress: () => deleteDocument(doc.id),
            },
          ],
        );
        return;
      }

      await sharePDF(doc.pdfFileName);
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'No se pudo abrir el documento');
    }
  };

  const handleDeleteDocument = (doc: DocumentMetadata) => {
    Alert.alert(
      'Eliminar Documento',
      `¿Estás seguro de que quieres eliminar ${
        doc.tipo === 'factura' ? 'la factura' : 'el presupuesto'
      } ${doc.numeroDocumento}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePDF(doc.pdfFileName);
              deleteDocument(doc.id);
            } catch (error) {
              console.error('Error deleting document:', error);
              deleteDocument(doc.id);
            }
          },
        },
      ],
    );
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'factura', label: 'Facturas' },
    { key: 'presupuesto', label: 'Presupuestos' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={STRINGS.navigation.historial} />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterTab,
              filter === f.key && styles.filterTabActive,
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Document List */}
      <FlatList
        data={filteredDocuments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={() => handleDocumentPress(item)}
            onDelete={() => handleDeleteDocument(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title={STRINGS.empty.historial}
            description="Crea tu primera factura o presupuesto para verlo aquí"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: COLORS.textInverse,
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
    flexGrow: 1,
  },
});
