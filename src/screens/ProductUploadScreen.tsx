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
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { uploadProduct, Shape, TPO, ProductImage } from '../services/productService';

type ProductUploadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductUpload'>;

const ProductUploadScreen = () => {
  const navigation = useNavigation<ProductUploadScreenNavigationProp>();
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedShape, setSelectedShape] = useState<Shape>('round');
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [price, setPrice] = useState('');
  const [productionTime, setProductionTime] = useState('');
  const [selectedTPOs, setSelectedTPOs] = useState<TPO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickMainImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (result.assets && result.assets[0]) {
      setMainImage(result.assets[0].uri || null);
    }
  };

  const pickProductImages = async () => {
    if (productImages.length >= 5) {
      Alert.alert('알림', '최대 5장까지만 업로드 가능합니다.');
      return;
    }

    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    });

    if (result.assets && result.assets[0]) {
      setProductImages([...productImages, { uri: result.assets[0].uri || '', description: '' }]);
    }
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

  const toggleTPO = (tpo: TPO) => {
    if (selectedTPOs.includes(tpo)) {
      setSelectedTPOs(selectedTPOs.filter(t => t !== tpo));
    } else {
      setSelectedTPOs([...selectedTPOs, tpo]);
    }
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
    
    if (selectedTPOs.length === 0) {
      Alert.alert('알림', '최소 하나 이상의 TPO를 선택해주세요.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await uploadProduct({
        mainImage,
        productName,
        productDescription,
        selectedShape,
        productImages,
        price,
        productionTime,
        selectedTPOs,
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
        <TouchableOpacity style={styles.imageUpload} onPress={pickMainImage}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.mainImage} />
          ) : (
            <Text>이미지 선택</Text>
          )}
        </TouchableOpacity>
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
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>상품 상세이미지</Text>
        <ScrollView horizontal style={styles.imageScroll}>
          {productImages.map((image, index) => (
            <View key={index} style={styles.imageBlock}>
              <Image source={{ uri: image.uri }} style={styles.productImage} />
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
            <TouchableOpacity style={styles.addImageButton} onPress={pickProductImages}>
              <Text>이미지 추가</Text>
            </TouchableOpacity>
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

      <View style={styles.section}>
        <Text style={styles.label}>TPO</Text>
        <View style={styles.tpoContainer}>
          {(['daily', 'party', 'wedding', 'performance'] as TPO[]).map((tpo) => (
            <TouchableOpacity
              key={tpo}
              style={[
                styles.tpoButton,
                selectedTPOs.includes(tpo) && styles.tpoButtonActive,
              ]}
              onPress={() => toggleTPO(tpo)}
            >
              <Text
                style={[
                  styles.tpoButtonText,
                  selectedTPOs.includes(tpo) && styles.tpoButtonTextActive,
                ]}
              >
                {tpo === 'daily' && '데일리'}
                {tpo === 'party' && '파티'}
                {tpo === 'wedding' && '웨딩'}
                {tpo === 'performance' && '공연'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tpoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tpoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tpoButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tpoButtonText: {
    color: '#000',
  },
  tpoButtonTextActive: {
    color: '#fff',
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
});

export default ProductUploadScreen; 