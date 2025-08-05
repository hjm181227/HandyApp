import React, { useState, useEffect } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Icon, Searchbar } from "react-native-paper";
import HandyColors from "../../colors";
import ItemScrollBanner from "../components/item-scroll-banner";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';
import ProductCard from '../components/ProductCard';
import { getProductList } from '../api/product';
import { Product } from '../types/product';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'recommended' | 'ranking'>('recommended');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [rankingProducts, setRankingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const tabNames = {
    recommended: '추천',
    ranking: '랭킹',
  };

  // 상품 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // 추천 상품 로드 (RECOMMEND)
        const recommendedResponse = await getProductList(6, 'RECOMMEND');
        setRecommendedProducts(recommendedResponse.data);
        
        // 랭킹 상품 로드 (CREATED_AT_DESC)
        const rankingResponse = await getProductList(6, 'CREATED_AT_DESC');
        setRankingProducts(rankingResponse.data);
        
      } catch (error) {
        console.error('상품 데이터 로드 실패:', error);
        // 에러 시 빈 배열로 설정
        setRecommendedProducts([]);
        setRankingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const renderTabButton = (tab: 'recommended' | 'ranking', label: string) => (
    <TouchableOpacity
      style={[styles.tabButton, selectedTab === tab && styles.selectedTabButton]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[styles.tabButtonText, selectedTab === tab && styles.selectedTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={HandyColors.primary90} />
          <Text style={styles.loadingText}>상품을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <Image
            source={require('../../assets/images/logo-home.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('ModalStack', {
              screen: 'Cart'
            })}>
              <Icon source={'shopping-outline'} size={22} color={'white'}/>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Searchbar
            placeholder="상품을 검색하세요"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                navigation.navigate('ModalStack', {
                  screen: 'SearchResult',
                  params: { keyword: searchQuery.trim() }
                });
              }
            }}
            style={{ backgroundColor: 'white', borderRadius: 8, height: 40 }}
            inputStyle={{ fontSize: 16, padding: 0, minHeight: 0 }}
          />
        </View>
        <View>
          <FlatList
            data={['recommended', 'ranking']}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderTabButton(item as 'recommended' | 'ranking', tabNames[item as 'recommended' | 'ranking'])}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentSection}>
        {selectedTab === 'recommended' ? (
          <>
            <View style={styles.imageBanner}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.banner}
              >
                <Image
                  style={styles.image}
                  resizeMode='contain'
                  source={require('../../assets/images/banner.png')}
                />
              </TouchableOpacity>
            </View>
            <ItemScrollBanner items={recommendedProducts.map(p => ({ ...p, imageUrl: p.mainImageUrl }))} title={'추천 상품'} />
            <ItemScrollBanner items={rankingProducts.map(p => ({ ...p, imageUrl: p.mainImageUrl }))} title={'베스트 셀러'} />
          </>
        ) : (
          <View style={styles.productGrid}>
            {rankingProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={product.price}
                imageUrl={product.mainImageUrl}
                rank={index + 1}
              />
            ))}
          </View>
        )}
        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ModalStack', {
                  screen: 'PrivacyPolicy'
                });
              }}
              style={styles.footerLinkContainer}
            >
              <Text style={styles.footerLink}>개인정보처리방침</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ModalStack', {
                  screen: 'Terms'
                });
              }}
              style={styles.footerLinkContainer}
            >
              <Text style={styles.footerLink}>이용약관</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Handy</Text>
            <Text style={styles.companyDetail}>대표: 홍길동</Text>
            <Text style={styles.companyDetail}>사업자등록번호: 123-45-67890</Text>
            <Text style={styles.companyDetail}>주소: 경기도 용인시 기흥구 공세로 150-29、 B01-G160호</Text>
            <Text style={styles.companyDetail}>이메일: support@handy.com</Text>
          </View>
          <Text style={styles.copyright}>© 2024 Handy. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: HandyColors.surface
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HandyColors.surface
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: HandyColors.grayLight,
  },
  topSection: {
    padding: 12,
    paddingBottom: 0,
    gap: 8,
    backgroundColor: HandyColors.primary40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4
  },
  logo: {
    width: 100,
    height: 80
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  tabButton: {
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  selectedTabButton: {
    color: HandyColors.primary90,
    borderBottomWidth: 3,
    paddingBottom: 8,
    borderBottomColor: HandyColors.primary90
  },
  tabButtonText: {
    fontSize: 14,
    paddingVertical: 4,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedTabButtonText: {
    color: HandyColors.primary80,
  },
  contentSection: {},
  imageBanner: {
    marginVertical: 20,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    height: 300,
    width: 'auto',
    maxHeight: 300,
    backgroundColor: HandyColors.vanilla,
    overflow: 'hidden',
  },
  banner: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    flex: 1
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  footerLinkContainer: {
    padding: 8,
  },
  footerLink: {
    color: HandyColors.primary40,
    fontSize: 14,
    fontWeight: '500',
  },
  companyInfo: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  companyDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;
