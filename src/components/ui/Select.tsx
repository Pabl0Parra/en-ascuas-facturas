import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  SPACING,
  BORDER_RADIUS,
  FONT_SIZE,
} from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : options;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        style={[styles.selectButton, error && styles.selectButtonError]}
      >
        <Text
          style={[styles.selectText, !selectedOption && styles.placeholderText]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClose}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {searchable && (
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          )}

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingBottom: insets.bottom + SPACING.lg,
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item.value)}
                style={[
                  styles.optionItem,
                  item.value === value && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText,
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay opciones</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    backgroundColor: colors.background,
  },
  selectButtonError: {
    borderColor: colors.error,
  },
  selectText: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
  },
  placeholderText: {
    color: colors.textMuted,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    color: colors.error,
    marginTop: SPACING.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  searchInput: {
    margin: SPACING.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  selectedOption: {
    backgroundColor: colors.surface,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    padding: SPACING.lg,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: FONT_SIZE.md,
  },
});
