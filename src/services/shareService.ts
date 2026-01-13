import * as Sharing from 'expo-sharing';

export const shareDocument = async (
  filePath: string,
  mimeType: string = 'application/pdf'
): Promise<void> => {
  const isAvailable = await Sharing.isAvailableAsync();
  
  if (!isAvailable) {
    throw new Error('Compartir no está disponible en este dispositivo');
  }
  
  await Sharing.shareAsync(filePath, {
    mimeType,
    dialogTitle: 'Compartir documento',
  });
};

export const isShareAvailable = async (): Promise<boolean> => {
  return Sharing.isAvailableAsync();
};
