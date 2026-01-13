import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Loading } from '../../src/components/ui/Loading';
import { useDocumentStore } from '../../src/stores/documentStore';
import { getPDFPath, sharePDF, doesPDFExist } from '../../src/services/fileService';
import { COLORS } from '../../src/constants/theme';

export default function DocumentoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const getDocumentById = useDocumentStore((state) => state.getDocumentById);
  
  useEffect(() => {
    const openDocument = async () => {
      if (!id) {
        Alert.alert('Error', 'Documento no encontrado');
        router.back();
        return;
      }
      
      const document = getDocumentById(id);
      
      if (!document) {
        Alert.alert('Error', 'Documento no encontrado');
        router.back();
        return;
      }
      
      try {
        const pdfPath = getPDFPath(document.pdfFileName);
        const exists = await doesPDFExist(pdfPath);
        
        if (!exists) {
          Alert.alert('Error', 'El archivo PDF no existe');
          router.back();
          return;
        }
        
        await sharePDF(pdfPath);
        router.back();
      } catch (error) {
        console.error('Error opening document:', error);
        Alert.alert('Error', 'No se pudo abrir el documento');
        router.back();
      }
    };
    
    openDocument();
  }, [id]);
  
  return (
    <SafeAreaView style={styles.container}>
      <Loading />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
