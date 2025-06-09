import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator, Alert, DimensionValue } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { IconButton } from 'react-native-paper';
import { getPresignedUrl } from '../api/upload';

interface ImageUploaderProps {
  onUploadSuccess: (presignedUrl: string) => void;
  label?: string;
  iconName?: string;
  width?: DimensionValue;
  height?: DimensionValue;
}

const ImageUploader = ({ 
  onUploadSuccess, 
  label = '이미지 선택',
  iconName = 'image',
  width = '100%',
  height = 200
}: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
      quality: 1,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      Alert.alert('알림', result.errorMessage || '이미지 선택 중 오류가 발생했습니다.');
      return;
    }

    if (result.assets && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (!imageUri) {
        Alert.alert('알림', '이미지 URI를 찾을 수 없습니다.');
        return;
      }
      await uploadImage(imageUri);
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      setLoading(true);
      setSelectedImage(imageUri);

      // 파일 이름 생성 (timestamp + random string)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `product_${timestamp}_${randomString}.jpg`;

      // presigned URL 요청
      const presignedUrl = await getPresignedUrl(fileName);

      // 이미지를 Blob으로 변환
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // S3에 직접 업로드
      await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
      });

      // presigned URL에서 실제 S3 URL 추출 (query parameters 제거)
      const s3Url = presignedUrl.split('?')[0];
      onUploadSuccess(s3Url);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('알림', '이미지 업로드에 실패했습니다.');
      setSelectedImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        !selectedImage && styles.emptyContainer,
        { width, height }
      ]} 
      onPress={pickImage}
      disabled={loading}
    >
      {selectedImage ? (
        <>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <IconButton
            icon="pencil"
            size={24}
            iconColor="#007AFF"
            style={styles.editButton}
            onPress={pickImage}
          />
        </>
      ) : (
        <View style={styles.placeholderContainer}>
          <IconButton
            icon={iconName}
            size={32}
            iconColor="#007AFF"
          />
          <Text style={styles.uploadText}>{label}</Text>
        </View>
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  emptyContainer: {
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    margin: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ImageUploader;
