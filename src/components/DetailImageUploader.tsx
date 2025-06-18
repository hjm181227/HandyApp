import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, IconButton } from 'react-native-paper';
import { ProductImage } from '../services/productService';
import ImageUploader from './ImageUploader';

interface DetailImageUploaderProps {
  onUploadSuccess?: (images: ProductImage[]) => void;
  onUploadError?: (error: Error) => void;
  onImageChanged?: (data: { index: number; imageUrl: string }) => void;
  maxImages?: number;
}

const DetailImageUploader: React.FC<DetailImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onImageChanged,
  maxImages = 5,
}) => {
  const [images, setImages] = useState<ProductImage[]>([]);

  const handleImageUpload = (imageUrl: string, index: number) => {
    const newImages = [...images];
    if (index >= newImages.length) {
      // 새로운 이미지 추가
      newImages.push({ imageUrl, description: '' });
    } else {
      // 기존 이미지 업데이트
      newImages[index] = { description: newImages[index].description, imageUrl };
    }
    setImages(newImages);
    onUploadSuccess?.(newImages);
    onImageChanged?.({ index, imageUrl });
  };

  const handleDescriptionChange = (text: string, index: number) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], description: text };
    setImages(newImages);
    onUploadSuccess?.(newImages);
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadSuccess?.(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.imagesRow}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                <ImageUploader
                  onUploadSuccess={(url) => handleImageUpload(url, index)}
                  onUploadError={onUploadError}
                  onImageChanged={(url) => handleImageUpload(url, index)}
                  width={200}
                  height={200}
                  initialValue={image.imageUrl}
                />
                <IconButton
                  icon="close"
                  size={20}
                  style={styles.removeButton}
                  onPress={() => handleImageRemove(index)}
                />
              </View>
              <TextInput
                value={image.description}
                onChangeText={(text) => handleDescriptionChange(text, index)}
                placeholder="이미지 설명"
                style={styles.descriptionInput}
              />
            </View>
          ))}
        </View>
        {images.length < maxImages && (
          <View style={styles.imageContainer}>
            <ImageUploader
              onUploadSuccess={(url) => handleImageUpload(url, images.length)}
              onUploadError={onUploadError}
              onImageChanged={(url) => handleImageUpload(url, images.length)}
              width={200}
              height={200}
              label="상세 이미지 추가"
              iconName="plus"
            />
          </View>
        )}
      </ScrollView>
      {images.length >= maxImages && (
        <Text style={styles.maxImagesText}>
          최대 {maxImages}개의 상세 이미지를 등록할 수 있습니다.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: 200,
    marginRight: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 0,
  },
  descriptionInput: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  maxImagesText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DetailImageUploader;
