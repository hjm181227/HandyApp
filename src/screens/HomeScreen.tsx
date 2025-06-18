import React, { useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Searchbar } from "react-native-paper";
import HandyColors from "../../colors";
import ItemScrollBanner from "../components/item-scroll-banner";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';
import ProductCard from '../components/ProductCard';

// 임시 상품 데이터 타입
type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  rank?: number;
};

// 임시 추천 상품 데이터
const recommendedProducts: Product[] = [
  {
    id: 1,
    name: '클래식 네일',
    price: 35000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '클래식한 디자인의 네일'
  },
  {
    id: 2,
    name: '아트 네일',
    price: 45000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '예술적인 디자인의 네일'
  },
  {
    id: 3,
    name: '심플 네일',
    price: 30000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '심플한 디자인의 네일'
  },
  {
    id: 4,
    name: '글리터 네일',
    price: 40000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '반짝이는 글리터 네일'
  },
  {
    id: 5,
    name: '메탈릭 네일',
    price: 42000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '메탈릭한 느낌의 네일'
  },
  {
    id: 6,
    name: '젤 네일',
    price: 38000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '젤 타입의 네일'
  },
];

// 임시 랭킹 상품 데이터
const rankingProducts: Product[] = [
  {
    id: 1,
    name: '클래식 네일',
    price: 35000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '클래식한 디자인의 네일',
    rank: 1
  },
  {
    id: 2,
    name: '아트 네일',
    price: 45000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '예술적인 디자인의 네일',
    rank: 2
  },
  {
    id: 3,
    name: '심플 네일',
    price: 30000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '심플한 디자인의 네일',
    rank: 3
  },
  {
    id: 4,
    name: '글리터 네일',
    price: 40000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '반짝이는 글리터 네일',
    rank: 4
  },
  {
    id: 5,
    name: '메탈릭 네일',
    price: 42000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '메탈릭한 느낌의 네일',
    rank: 5
  },
  {
    id: 6,
    name: '젤 네일',
    price: 38000,
    imageUrl: 'https://via.placeholder.com/150',
    description: '젤 타입의 네일',
    rank: 6
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [ searchQuery, setSearchQuery ] = React.useState('');
  const [ selectedTab, setSelectedTab ] = useState<'recommended' | 'ranking'>('recommended');
  const tabNames = {
    recommended: '추천',
    ranking: '랭킹',
  }

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
            {/*<Icon source={'bell-outline'} size={22} color={'white'}/>*/}
            <TouchableOpacity onPress={() => navigation.navigate('ModalStack', {
              screen: 'Cart'
            })}>
              <Icon source={'shopping-outline'} size={22} color={'white'}/>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
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
            <ItemScrollBanner items={recommendedProducts} title={'추천 상품'} />
            <ItemScrollBanner items={rankingProducts} title={'베스트 셀러'} />
          </>
        ) : (
          <View style={styles.productGrid}>
            {rankingProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id.toString()}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                rank={product.rank}
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
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 40
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: HandyColors.surface
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
    // paddingVertical: 4
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
    alignItems: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
