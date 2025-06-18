import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import HandyColors from '../../colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type CategoryProductListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CategoryProductList'>;

// 임시 상품 데이터 타입
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

// 임시 상품 데이터
const mockProducts: Product[] = [
  {
    id: '1',
    name: '클래식 네일',
    price: 35000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '클래식한 디자인의 네일'
  },
  {
    id: '2',
    name: '아트 네일',
    price: 45000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '예술적인 디자인의 네일'
  },
  {
    id: '3',
    name: '심플 네일',
    price: 30000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '심플한 디자인의 네일'
  },
  {
    id: '4',
    name: '글리터 네일',
    price: 40000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '반짝이는 글리터 네일'
  },
  {
    id: '5',
    name: '메탈릭 네일',
    price: 42000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '메탈릭한 느낌의 네일'
  },
  {
    id: '6',
    name: '젤 네일',
    price: 38000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '젤 타입의 네일'
  },
];

const CategoryProductListScreen = () => {
  const navigation = useNavigation<CategoryProductListScreenNavigationProp>();
  const route = useRoute();
  const theme = useTheme();
  const { category, subcategory } = route.params as { category: string; subcategory: string };
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 실제 구현시에는 API 호출로 대체
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [category, subcategory]);

  const renderProductCard = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => navigation.navigate('ModalStack', {
        screen: 'ProductDetail',
        params: {
          productId: product.id,
          title: product.name,
          price: product.price,
          image: product.imageUrl,
          description: product.description || '상품 설명이 없습니다.',
        }
      })}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: product.imageUrl }} style={styles.productImage} />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice}>
            {product.price.toLocaleString()}원
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={HandyColors.primary40} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.subcategoryTitle}>{subcategory}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.productGrid}>
          {products.map(renderProductCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  subcategoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  productCard: {
    width: '33.33%',
    padding: 4,
  },
  card: {
    margin: 4,
    elevation: 2,
  },
  productImage: {
    height: 120,
  },
  cardContent: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: HandyColors.primary40,
  },
});

export default CategoryProductListScreen;
