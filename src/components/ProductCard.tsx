import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import HandyColors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/stack';

type ProductCardNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rank?: number;
};

const ProductCard = ({ id, name, price, imageUrl, rank }: ProductCardProps) => {
  const navigation = useNavigation<ProductCardNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ModalStack', {
        screen: 'ProductDetail',
        params: {
          productId: id,
          title: name,
          price: price,
          image: imageUrl,
          description: '상품 설명이 없습니다.',
          rank: rank
        }
      })}
    >
      <Card style={styles.card}>
        {rank !== undefined && (
          <View style={styles.rankContainer}>
            <View style={[
              styles.rankBadge,
              rank <= 3 && styles.topRankBadge
            ]}>
              <Text style={[
                styles.rankText,
                rank <= 3 && styles.topRankText
              ]}>
                {rank}
              </Text>
            </View>
          </View>
        )}
        <Card.Cover source={{ uri: imageUrl }} style={styles.productImage} />
        <Card.Content style={styles.cardContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {name}
          </Text>
          <Text style={styles.productPrice}>
            {price.toLocaleString()}원
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: '33.33%',
    padding: 4,
  },
  card: {
    margin: 4,
    elevation: 2,
  },
  rankContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRankBadge: {
    backgroundColor: HandyColors.primary40,
  },
  rankText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  topRankText: {
    color: 'white',
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

export default ProductCard; 