import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Toggle } from '../ui/Toggle';
import { Card } from '../ui/Card';
import { SPACING } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    backgroundColor: colors.surface,
  },
});
