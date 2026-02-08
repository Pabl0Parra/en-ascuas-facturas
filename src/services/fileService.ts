import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

// Get the permanent documents directory
const getDocumentsDir = (): string => {
  const dir = FileSystem.documentDirectory;
  if (!dir) {
    throw new Error('No se pudo acceder al almacenamiento');
  }
  return dir;
};

// Ensure our PDFs folder exists
const ensurePDFDirectory = async (): Promise<string> => {
  const pdfDir = `${getDocumentsDir()}facturas/`;

  const dirInfo = await FileSystem.getInfoAsync(pdfDir);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(pdfDir, { intermediates: true });
  }

  return pdfDir;
};

export const savePDF = async (
  tempUri: string,
  fileName: string,
): Promise<string> => {
  console.log('[FileService] savePDF - tempUri:', tempUri);
  console.log('[FileService] savePDF - fileName:', fileName);

  try {
    // Verify temp file exists
    const tempInfo = await FileSystem.getInfoAsync(tempUri);
    if (!tempInfo.exists) {
      throw new Error('El archivo PDF temporal no se generó correctamente');
    }

    // Get permanent directory
    const pdfDir = await ensurePDFDirectory();
    const finalPath = `${pdfDir}${fileName}.pdf`;

    console.log('[FileService] savePDF - finalPath:', finalPath);

    // Check if file already exists (overwrite)
    const existingFile = await FileSystem.getInfoAsync(finalPath);
    if (existingFile.exists) {
      await FileSystem.deleteAsync(finalPath);
    }

    // Copy to permanent location
    await FileSystem.copyAsync({
      from: tempUri,
      to: finalPath,
    });

    // Verify copy was successful
    const savedInfo = await FileSystem.getInfoAsync(finalPath);
    if (!savedInfo.exists) {
      throw new Error('Error al guardar el archivo');
    }

    console.log('[FileService] savePDF - SUCCESS, saved to:', finalPath);
    return finalPath;
  } catch (error) {
    console.error('savePDF - ERROR:', error);
    throw error;
  }
};

export const sharePDF = async (filePath: string): Promise<void> => {
  console.log('sharePDF - filePath:', filePath);

  try {
    // Verify file exists before sharing
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      throw new Error('El archivo no existe');
    }

    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      throw new Error('Compartir no está disponible en este dispositivo');
    }

    await Sharing.shareAsync(filePath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir documento',
    });
  } catch (error) {
    console.error('sharePDF - ERROR:', error);
    throw error;
  }
};

export const deletePDF = async (filePath: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      console.log('deletePDF - deleted:', filePath);
    }
  } catch (error) {
    console.error('deletePDF - ERROR:', error);
  }
};

export const doesPDFExist = async (filePath: string): Promise<boolean> => {
  try {
    console.log('[FileService] doesPDFExist - checking path:', filePath);
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    console.log('[FileService] doesPDFExist - exists:', fileInfo.exists);
    return fileInfo.exists;
  } catch {
    return false;
  }
};

// List all saved PDFs
export const listSavedPDFs = async (): Promise<string[]> => {
  try {
    const pdfDir = `${getDocumentsDir()}facturas/`;
    const dirInfo = await FileSystem.getInfoAsync(pdfDir);

    if (!dirInfo.exists) {
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(pdfDir);
    return files.filter((f) => f.endsWith('.pdf'));
  } catch {
    return [];
  }
};
