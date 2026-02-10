import { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { DocumentCard } from '../../src/components/historial/DocumentCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useDocumentStore } from '../../src/stores/documentStore';
import {
  deletePDF,
  doesPDFExist,
} from '../../src/services/fileService';
import { COLORS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import type { DocumentMetadata } from '../../src/types/document';

type FilterType = 'todos' | 'factura' | 'presupuesto';

export default function HistorialScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('todos');

  const documents = useDocumentStore((state) => state.documents);
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);

  const filteredDocuments =
    filter === 'todos'
      ? documents
      : documents.filter((doc) => doc.tipo === filter);

  const handleDocumentPress = async (doc: DocumentMetadata) => {
    try {
      console.log('[Historial] Opening document:', doc.numeroDocumento, 'Path:', doc.pdfFileName);
      const exists = await doesPDFExist(doc.pdfFileName);
      console.log('[Historial] File exists:', exists);

      if (!exists) {
        Alert.alert(
          t('historial.documentNotFound'),
          t('historial.documentNotFoundDescription'),
          [
            { text: t('actions.cancelar'), style: 'cancel' },
            {
              text: t('actions.eliminar'),
              style: 'destructive',
              onPress: () => deleteDocument(doc.id),
            },
          ],
        );
        return;
      }

      console.log('[Historial] Navigating to PDF viewer with path:', doc.pdfFileName);
      router.push({
        pathname: '/(tabs)/pdf-viewer',
        params: {
          filePath: doc.pdfFileName,
          title: `${doc.tipo === 'factura' ? t('historial.Invoice') : t('historial.Quote')} ${doc.numeroDocumento}`,
          documentId: doc.id,
        },
      });
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', t('historial.errorOpeningDocument'));
    }
  };

  const handleDeleteDocument = (doc: DocumentMetadata) => {
    const type = doc.tipo === 'factura' ? t('historial.invoice') : t('historial.quote');
    Alert.alert(
      t('historial.deleteDocument'),
      t('historial.deleteDocumentConfirm', { type, number: doc.numeroDocumento }),
      [
        { text: t('actions.cancelar'), style: 'cancel' },
        {
          text: t('actions.eliminar'),
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
    { key: 'todos', label: t('historial.filters.todos') },
    { key: 'factura', label: t('historial.filters.facturas') },
    { key: 'presupuesto', label: t('historial.filters.presupuestos') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={t('navigation.historial')} />

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
            title={t('empty.historial')}
            description={t('empty.historialDescription')}
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