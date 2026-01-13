import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Toggle } from '../ui/Toggle';
import { Card } from '../ui/Card';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';
import { STRINGS } from '../../constants/strings';
import type { IVARate } from '../../types/document';

interface IVAToggleProps {
  tipoIVA: IVARate;
  onChangeTipoIVA: (tipo: IVARate) => void;
}

export const IVAToggle: React.FC<IVAToggleProps> = ({
  tipoIVA,
  onChangeTipoIVA,
}) => {
  const isInversionSujetoPasivo = tipoIVA === 0;
  
  const handleToggle = (value: boolean) => {
    onChangeTipoIVA(value ? 0 : 21);
  };
  
  return (
    <Card padding="md" style={styles.container}>
      <Toggle
        label={STRINGS.iva.inversionSujetoPasivo}
        value={isInversionSujetoPasivo}
        onValueChange={handleToggle}
        description={isInversionSujetoPasivo ? STRINGS.iva.inversionNota : STRINGS.iva.normal}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
});
