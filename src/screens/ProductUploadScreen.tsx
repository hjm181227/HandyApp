import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { uploadProduct, Shape, ProductSize, ProductImage } from '../services/productService';
import ImageUploader from '../components/ImageUploader';
import { Checkbox } from 'react-native-paper';

type ProductUploadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductUpload'>;

const ProductUploadScreen = () => {
  const navigation = useNavigation<ProductUploadScreenNavigationProp>();
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedShape, setSelectedShape] = useState<Shape>('round');
  const [shapeChangable, setShapeChangable] = useState(false);
  const [selectedLength, setSelectedLength] = useState<ProductSize>('MEDIUM');
  const [lengthChangable, setLengthChangable] = useState(false);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [price, setPrice] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMainImageUpload = (presignedUrl: string) => {
    setMainImage({ imageUrl: presignedUrl });
  };

  const handleProductImageUpload = (presignedUrl: string) => {
    if (productImages.length >= 5) {
      Alert.alert('알림', '최대 5장까지만 업로드 가능합니다.');
      return;
    }
    setProductImages([...productImages, { imageUrl: presignedUrl, description: '' }]);
  };

  const updateImageDescription = (index: number, description: string) => {
    const newImages = [...productImages];
    newImages[index].description = description;
    setProductImages(newImages);
  };

  const removeProductImage = (index: number) => {
    const newImages = productImages.filter((_, i) => i !== index);
    setProductImages(newImages);
  };

  const validateForm = (): boolean => {
    if (!mainImage) {
      Alert.alert('알림', '대표 이미지를 선택해주세요.');
      return false;
    }

    if (!productName.trim()) {
      Alert.alert('알림', '상품명을 입력해주세요.');
      return false;
    }

    if (!productDescription.trim()) {
      Alert.alert('알림', '상품 설명을 입력해주세요.');
      return false;
    }

    if (!price.trim()) {
      Alert.alert('알림', '가격을 입력해주세요.');
      return false;
    }

    if (!productionTime.trim()) {
      Alert.alert('알림', '제작 소요 시간을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !mainImage) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await uploadProduct({
        mainImage,
        name: productName,
        description: productDescription,
        shape: selectedShape,
        shapeChangable,
        length: selectedLength,
        lengthChangable,
        isCustomizable,
        detailImages: productImages,
        price: parseInt(price, 10),
        productionTime: parseInt(productionTime, 10),
      });

      if (result.success) {
        Alert.alert('성공', '상품이 성공적으로 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('오류', '상품 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>대표 이미지</Text>
        <View style={styles.imageUpload}>
          <ImageUploader
            onUploadSuccess={handleMainImageUpload}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품명</Text>
        <TextInput
          style={styles.input}
          value={productName}
          onChangeText={setProductName}
          placeholder="상품명을 입력하세요"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품 한줄설명</Text>
        <TextInput
          style={styles.input}
          value={productDescription}
          onChangeText={setProductDescription}
          placeholder="상품에 대한 간단한 설명을 입력하세요"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품 쉐입</Text>
        <Picker
          selectedValue={selectedShape}
          onValueChange={(value) => setSelectedShape(value as Shape)}
          style={styles.picker}
        >
          <Picker.Item label="라운드" value="round" />
          <Picker.Item label="아몬드" value="almond" />
          <Picker.Item label="오벌" value="oval" />
          <Picker.Item label="스틸레토" value="stiletto" />
          <Picker.Item label="스퀘어" value="square" />
          <Picker.Item label="코핀" value="coffin" />
        </Picker>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={shapeChangable ? 'checked' : 'unchecked'}
            onPress={() => setShapeChangable(!shapeChangable)}
          />
          <Text style={styles.checkboxLabel}>쉐입 변경 가능</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>길이</Text>
        <Picker
          selectedValue={selectedLength}
          onValueChange={(value) => setSelectedLength(value as ProductSize)}
          style={styles.picker}
        >
          <Picker.Item label="숏" value="SHORT" />
          <Picker.Item label="미디움" value="MEDIUM" />
          <Picker.Item label="롱" value="LONG" />
        </Picker>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={lengthChangable ? 'checked' : 'unchecked'}
            onPress={() => setLengthChangable(!lengthChangable)}
          />
          <Text style={styles.checkboxLabel}>길이 변경 가능</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={isCustomizable ? 'checked' : 'unchecked'}
            onPress={() => setIsCustomizable(!isCustomizable)}
          />
          <Text style={styles.checkboxLabel}>커스텀 가능 여부</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품 상세이미지</Text>
        <ScrollView horizontal style={styles.imageScroll}>
          {productImages.map((image, index) => (
            <View key={index} style={styles.imageBlock}>
              <Image source={{ uri: image.imageUrl }} style={styles.productImage} />
              <TextInput
                style={styles.imageDescription}
                value={image.description}
                onChangeText={(text) => updateImageDescription(index, text)}
                placeholder="이미지 설명"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeProductImage(index)}
              >
                <Text style={styles.removeButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          ))}
          {productImages.length < 5 && (
            <View style={styles.addImageButton}>
              <ImageUploader
                onUploadSuccess={handleProductImageUpload}
                label={productImages.length == 0 ? "상세 이미지 & 설명 추가" : ""}
                iconName={productImages.length == 0 ? undefined : "plus"}
              />
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>가격</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="가격을 입력하세요"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>제작 소요 시간 (일)</Text>
        <TextInput
          style={styles.input}
          value={productionTime}
          onChangeText={setProductionTime}
          placeholder="제작 소요 시간을 입력하세요"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>등록</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageBlock: {
    marginRight: 16,
    width: 200,
    flexDirection: 'column',
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  imageDescription: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
  addImageButton: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default ProductUploadScreen;
