import React, { useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { uploadProduct, Shape, ProductSize, ProductImage, ProductUploadData } from '../services/productService';
import { useUser } from '../context/UserContext';
import ImageUploader from '../components/ImageUploader';
import { Checkbox } from 'react-native-paper';
import DetailImageUploader from '../components/DetailImageUploader';

type ProductUploadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductUpload'>;

const ProductUploadScreen = () => {
  const navigation = useNavigation<ProductUploadScreenNavigationProp>();
  const { token } = useUser();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedShape, setSelectedShape] = useState<Shape>('ROUND');
  const [shapeChangable, setShapeChangable] = useState(false);
  const [selectedLength, setSelectedLength] = useState<ProductSize>('MEDIUM');
  const [lengthChangable, setLengthChangable] = useState(false);
  const [customAvailable, setCustomAvailable] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [price, setPrice] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMainImageUpload = (presignedUrl: string) => {
    const s3Url = presignedUrl.split('?')[0];
    setMainImage(s3Url);
  };

  const handleProductImageUpload = (presignedUrl: string) => {
    if (productImages.length >= 5) {
      Alert.alert('알림', '최대 5장까지만 업로드 가능합니다.');
      return;
    }
    const s3Url = presignedUrl.split('?')[0];
    setProductImages([...productImages, { imageUrl: s3Url, description: '' }]);
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

    if (!token) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }

    try {
      setIsLoading(true);

      const productData: ProductUploadData = {
        name: productName,
        description: productDescription,
        shape: selectedShape,
        shapeChangeable: shapeChangable,
        size: selectedLength,
        sizeChangeable: lengthChangable,
        price: Number(price),
        productionDays: Number(productionTime),
        categoryIds: [1], // 임시로 1번 카테고리 사용
        mainImageUrl: mainImage!,
        detailImages: productImages,
        customAvailable: customAvailable,
      };

      console.log('상품 등록 데이터:', productData);
      console.log('토큰:', token);
      await uploadProduct(productData, token);
      Alert.alert('성공', '상품이 등록되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('상품 등록 실패:', error);
      Alert.alert('오류', error instanceof Error ? error.message : '상품 등록에 실패했습니다.');
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
            status={customAvailable ? 'checked' : 'unchecked'}
            onPress={() => setCustomAvailable(!customAvailable)}
          />
          <Text style={styles.checkboxLabel}>커스텀 가능 여부</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품 상세이미지</Text>
        <DetailImageUploader
          onUploadSuccess={(images) => setProductImages(images)}
          onUploadError={(error) => {
            console.error('상세 이미지 업로드 실패:', error);
            Alert.alert('알림', '상세 이미지 업로드에 실패했습니다.');
          }}
          onImageChanged={({ index, imageUrl }) => {
            const newImages = [...productImages];
            newImages[index] = { ...newImages[index], imageUrl };
            setProductImages(newImages);
          }}
          maxImages={5}
        />
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
