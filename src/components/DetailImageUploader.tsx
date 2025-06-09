import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { IconButton, TextInput, ActivityIndicator } from 'react-native-paper';
import { getPresignedUrl } from '../api/upload';
import ImageUploader from './ImageUploader';
import EmptyPlaceholderComponent from './EmptyPlaceholderComponent';

interface DetailImage {
  url: string;
  description: string;
}

interface DetailImageUploaderProps {
  onUploadSuccess: (images: DetailImage[]) => void;
}

const DetailImageUploader = ({ onUploadSuccess }: DetailImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<DetailImage[]>([]);
  const MAX_IMAGES = 5;

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

      // 파일 이름 생성 (timestamp + random string)
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `product_detail_${timestamp}_${randomString}.jpg`;

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
      
      // 새 이미지 추가
      const newImages = [...images, { url: s3Url, description: '' }];
      setImages(newImages);
      onUploadSuccess(newImages);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('알림', '이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], description };
    setImages(newImages);
    onUploadSuccess(newImages);
  };

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadSuccess(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <ImageUploader
              width={200}
              height={200}
              onUploadSuccess={() => {}}
              label=""
              iconName=""
            />
            <View style={styles.imageInfoContainer}>
              <TextInput
                value={image.description}
                onChangeText={(text) => handleDescriptionChange(index, text)}
                placeholder="이미지 설명을 입력하세요"
                style={styles.descriptionInput}
              />
              <IconButton
                icon="delete"
                size={24}
                iconColor="#FF3B30"
                onPress={() => handleDeleteImage(index)}
              />
            </View>
          </View>
        ))}
        {images.length < MAX_IMAGES && (
          <ImageUploader
            width={200}
            height={200}
            onUploadSuccess={pickImage}
            label=""
            iconName="plus"
          />
        )}
      </ScrollView>
      {images.length >= MAX_IMAGES && (
        <EmptyPlaceholderComponent
          icon="information"
          message="상세 이미지는 최대 5개까지 등록 가능합니다"
        />
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingVertical: 8,
  },
  imageContainer: {
    marginRight: 16,
    width: 200,
  },
  imageInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
  },
  descriptionInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailImageUploader; 