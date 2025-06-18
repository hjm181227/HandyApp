import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, DimensionValue } from 'react-native';
import { IconButton } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { getPresignedUrl } from '../api/upload';

interface ImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
  onImageChanged?: (imageUrl: string) => void;
  width?: DimensionValue;
  height?: DimensionValue;
  label?: string;
  iconName?: string;
  initialValue?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onImageChanged,
  width = 200,
  height = 200,
  label = '이미지 선택',
  iconName = 'image',
  initialValue,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialValue || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValue && !imageUrl) {
      setImageUrl(initialValue);
    }
  }, [initialValue]);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        includeBase64: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        throw new Error(result.errorMessage || '이미지 선택 중 오류가 발생했습니다.');
      }

      if (!result.assets?.[0]?.uri) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }

      const selectedUri = result.assets[0].uri;
      setImageUrl(selectedUri);
      onImageChanged?.(selectedUri);
      await uploadImage(selectedUri);
    } catch (error) {
      console.error('Error picking image:', error);
      onUploadError?.(error instanceof Error ? error : new Error('이미지 선택 중 오류가 발생했습니다.'));
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setLoading(true);
      const fileName = `product_${Date.now()}.jpg`;
      const presignedUrl = await getPresignedUrl(fileName);

      const response = await fetch(uri);
      const blob = await response.blob();

      await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
      });

      const s3Url = presignedUrl.split('?')[0];
      setImageUrl(s3Url);
      onImageChanged?.(s3Url);
      onUploadSuccess?.(s3Url);
    } catch (error) {
      console.error('Error uploading image:', error);
      onUploadError?.(error instanceof Error ? error : new Error('이미지 업로드 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={[styles.image, { width, height }]} />
          <IconButton
            icon="close"
            size={20}
            style={styles.removeButton}
            onPress={() => {
              setImageUrl(null);
              onUploadSuccess?.('');
            }}
          />
        </View>
      ) : (
        <TouchableOpacity style={[styles.uploadButton, { width, height }]} onPress={pickImage}>
          <IconButton icon={iconName} size={32} />
          <Text style={styles.uploadText}>{label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
  },
});

export default ImageUploader;
