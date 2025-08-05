import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { getSellerProducts, Product } from '../../services/productService';
import { useUser } from '../../context/UserContext';
import ProductCard from '../../components/ProductCard';
import EmptyPlaceholderComponent from '../../components/EmptyPlaceholderComponent';

type ProductListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;

const SellerProductListScreen = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const { userData } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (!userData?.id) return;
    try {
      const response = await getSellerProducts(userData.id);
      setProducts(response.content);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyComponent = () => (
    <EmptyPlaceholderComponent
      icon="message-alert-outline"
      message="등록한 상품이 없습니다"
      actionButton={
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductUpload')}
        >
          <Text style={styles.addButtonText}>상품 등록</Text>
        </TouchableOpacity>
      }
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  addButton: {
    padding: 12,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SellerProductListScreen;
