import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image 
        source={{ uri: product.mainImageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toLocaleString()}원</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {product.shapeChangable ? '모양 변경 가능' : '모양 고정'}
          </Text>
          <Text style={styles.infoText}>
            {product.lengthChangable ? '길이 변경 가능' : '길이 고정'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProductCard; 