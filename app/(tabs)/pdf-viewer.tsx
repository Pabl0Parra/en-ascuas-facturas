import React from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/ui/Header';
import { COLORS, SPACING } from '../../src/constants/theme';

export default function PDFViewerScreen() {
    const router = useRouter();
    const { filePath, title } = useLocalSearchParams<{
        filePath: string;
        title: string;
    }>();

    const [status, setStatus] = React.useState<'loading' | 'opening' | 'error'>('loading');

    React.useEffect(() => {
        openPDF();
    }, []);

    const openPDF = async () => {
        if (!filePath) {
            Alert.alert('Error', 'No se encontró el archivo');
            router.back();
            return;
        }

        try {
            setStatus('opening');

            const canShare = await Sharing.isAvailableAsync();

            if (!canShare) {
                Alert.alert('Error', 'No se puede abrir el PDF en este dispositivo');
                router.back();
                return;
            }

            console.log('Opening PDF with system viewer:', filePath);

            // This opens the PDF with the system's default PDF viewer
            await Sharing.shareAsync(filePath, {
                mimeType: 'application/pdf',
                dialogTitle: title || 'Ver Documento',
                UTI: 'com.adobe.pdf',
            });

            // Wait a bit before going back to ensure the viewer opened
            setTimeout(() => {
                router.back();
            }, 500);

        } catch (error) {
            console.error('Error opening PDF:', error);
            setStatus('error');
            Alert.alert(
                'Error',
                'No se pudo abrir el PDF. Por favor, intenta de nuevo.',
                [
                    {
                        text: 'Volver',
                        onPress: () => router.back()
                    }
                ]
            );
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Header title={title || 'Documento'} showBack />
            <View style={styles.content}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.statusText}>
                    {status === 'loading' ? 'Preparando documento...' : 'Abriendo PDF...'}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.md,
    },
    statusText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginTop: SPACING.sm,
    },
});