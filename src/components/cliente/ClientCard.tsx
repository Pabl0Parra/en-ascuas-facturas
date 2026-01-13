import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
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
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
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
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  nifCif: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  direccion: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  ubicacion: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
});
