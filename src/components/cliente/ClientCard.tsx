import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import { SPACING, FONT_SIZE, FONTS } from '../../constants/theme';
import type { Client } from '../../types/client';

interface ClientCardProps {
  client: Client;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card padding="md" style={styles.container}>
        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={styles.nombre} numberOfLines={1}>
              {client.nombre}
            </Text>
            <Text style={styles.nifCif}>{client.nifCif}</Text>
            <Text style={styles.direccion} numberOfLines={1}>
              {client.direccion}
            </Text>
            <Text style={styles.ubicacion} numberOfLines={1}>
              {client.codigoPostal} {client.ciudad} ({client.provincia})
            </Text>
          </View>

          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={styles.actionButton}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                style={styles.actionButton}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  nifCif: {
    fontSize: FONT_SIZE.sm,
    color: colors.primary,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xs,
  },
  direccion: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
  },
  ubicacion: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
});
