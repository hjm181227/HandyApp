import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, IconButton, Searchbar, Chip } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ModalStackParamList } from '../navigation/modalStack';
import HandyColors from "../../colors";
import { searchProducts } from '../api/product';
import { Product, ProductSearchRequest } from '../types/product';
import ProductCard from '../components/ProductCard';

type SearchResultScreenNavigationProp = StackNavigationProp<ModalStackParamList, 'SearchResult'>;
type SearchResultScreenRouteProp = RouteProp<ModalStackParamList, 'SearchResult'>;

const SearchResultScreen = () => {
  const navigation = useNavigation<SearchResultScreenNavigationProp>();
  const route = useRoute<SearchResultScreenRouteProp>();
  const { keyword } = route.params;
  
  const [searchQuery, setSearchQuery] = useState(keyword);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState<'CREATED_AT_DESC' | 'PRICE_DESC' | 'PRICE_ASC' | 'NAME_ASC'>('CREATED_AT_DESC');

  const sortOptions = [
    { label: '최신순', value: 'CREATED_AT_DESC' as const },
    { label: '가격높은순', value: 'PRICE_DESC' as const },
    { label: '가격낮은순', value: 'PRICE_ASC' as const },
    { label: '이름순', value: 'NAME_ASC' as const },
  ];

  const fetchSearchResults = async (page: number = 1, newKeyword?: string) => {
    try {
      setLoading(true);
      const searchRequest: ProductSearchRequest = {
        keyword: newKeyword || searchQuery,
        page,
        size: 10,
        sort: selectedSort,
      };

      const response = await searchProducts(searchRequest);
      
      if (page === 1) {
        setProducts(response.data);
      } else {
        setProducts(prev => [...prev, ...response.data]);
      }
      
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (error) {
      console.error('검색 결과 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(1, keyword);
  }, [keyword, selectedSort]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchSearchResults(1, searchQuery);
    }
  };

  const handleLoadMore = () => {
    if (!loading && products.length < total) {
      fetchSearchResults(currentPage + 1);
    }
  };

  const handleSortChange = (sort: typeof selectedSort) => {
    setSelectedSort(sort);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      id={item.id.toString()}
      name={item.name}
      price={item.price}
      imageUrl={item.mainImageUrl}
    />
  );

  const renderSortChip = (option: typeof sortOptions[0]) => (
    <Chip
      key={option.value}
      selected={selectedSort === option.value}
      onPress={() => handleSortChange(option.value)}
      style={styles.sortChip}
      textStyle={selectedSort === option.value ? styles.selectedSortText : styles.sortText}
    >
      {option.label}
    </Chip>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="상품을 검색하세요"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
          />
        </View>
        <IconButton
          icon="magnify"
          size={24}
          onPress={handleSearch}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <FlatList
          data={sortOptions}
          renderItem={({ item }) => renderSortChip(item)}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>

      {/* Search Results */}
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={HandyColors.primary90} />
          <Text style={styles.loadingText}>검색 중...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              검색 결과 {total}개
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                검색 결과가 없습니다.
              </Text>
              <Text style={styles.emptySubText}>
                다른 키워드로 검색해보세요.
              </Text>
            </View>
          }
          ListFooterComponent={
            loading && products.length > 0 ? (
              <ActivityIndicator size="small" color={HandyColors.primary90} style={styles.loadingMore} />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  searchBar: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 16,
  },
  sortContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortList: {
    paddingHorizontal: 16,
  },
  sortChip: {
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  sortText: {
    color: '#666',
  },
  selectedSortText: {
    color: HandyColors.primary90,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: HandyColors.grayLight,
  },
  productList: {
    padding: 16,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: HandyColors.grayLight,
  },
  loadingMore: {
    paddingVertical: 20,
  },
});

export default SearchResultScreen; 