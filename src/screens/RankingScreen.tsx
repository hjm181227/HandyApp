import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import HandyColors from '../../colors';
import ProductCard from '../components/ProductCard';

// 임시 상품 데이터 타입
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rank: number;
};

// 임시 상품 데이터
const mockProducts: Product[] = [
  {
    id: '1',
    name: '클래식 네일',
    price: 35000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '클래식한 디자인의 네일',
    rank: 1
  },
  {
    id: '2',
    name: '아트 네일',
    price: 45000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '예술적인 디자인의 네일',
    rank: 2
  },
  {
    id: '3',
    name: '심플 네일',
    price: 30000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '심플한 디자인의 네일',
    rank: 3
  },
  {
    id: '4',
    name: '글리터 네일',
    price: 40000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '반짝이는 글리터 네일',
    rank: 4
  },
  {
    id: '5',
    name: '메탈릭 네일',
    price: 42000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '메탈릭한 느낌의 네일',
    rank: 5
  },
  {
    id: '6',
    name: '젤 네일',
    price: 38000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '젤 타입의 네일',
    rank: 6
  },
];

const RankingScreen = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 실제 구현시에는 API 호출로 대체
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

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
        <Text style={styles.headerTitle}>인기 상품</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.productGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              rank={product.rank}
            />
          ))}
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
  headerTitle: {
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
});

export default RankingScreen; 