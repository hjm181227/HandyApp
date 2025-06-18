import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Searchbar, IconButton, Avatar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import HandyColors from '../../colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryStackParamList } from '../navigation/categoryStack';

type CategoryScreenNavigationProp = NativeStackNavigationProp<CategoryStackParamList, 'CategoryMain'>;

type CategoryOption = {
  name: string;
  subcategories: string[];
};

const categoryOptions: CategoryOption[] = [
  {
    name: '디자인/스타일',
    subcategories: ['신상', '심플', '화려', '아트', '트렌디', '클래식', '시즌', '테마', '키치', '네츄럴']
  },
  {
    name: '컬러',
    subcategories: ['레드', '핑크', '블루', '그린', '뉴트럴', '블랙/화이트']
  },
  {
    name: '텍스쳐',
    subcategories: ['글리터', '크롬/메탈', '매트', '벨벳', '젤', '자석']
  },
  {
    name: '쉐입/길이',
    subcategories: ['라운드', '아몬드', '오벌', '스틸레토', '스퀘어', '코핀', 'Long', 'Medium', 'Short']
  },
  {
    name: 'TPO',
    subcategories: ['데일리', '파티', '웨딩', '공연', 'Special Day']
  },
  {
    name: '아티스트/브랜드',
    subcategories: ['아티스트', '브랜드']
  },
  {
    name: '나라',
    subcategories: ['Korea', 'Japan', 'America', 'Europe']
  }
];

const CategoryScreen = () => {
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('category');
  const [selectedOption, setSelectedOption] = useState(categoryOptions[0]);
  const theme = useTheme();

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ fontSize: 16, padding: 0, minHeight: 0 }}
        />
        <IconButton
          icon="shopping-outline"
          size={24}
          onPress={() => navigation.navigate('ModalStack', {
            screen: 'Cart'
          })}
          style={styles.cartButton}
        />
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'category' && styles.selectedTab]}
          onPress={() => setSelectedTab('category')}
        >
          <Text style={[styles.tabText, selectedTab === 'category' && styles.selectedTabText]}>
            카테고리
          </Text>
        </TouchableOpacity>
        {/*<TouchableOpacity*/}
        {/*  style={[styles.tab, selectedTab === 'service' && styles.selectedTab]}*/}
        {/*  onPress={() => setSelectedTab('service')}*/}
        {/*>*/}
        {/*  <Text style={[styles.tabText, selectedTab === 'service' && styles.selectedTabText]}>*/}
        {/*    서비스*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
    </View>
  );

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      {categoryOptions.map((option) => (
        <TouchableOpacity
          key={option.name}
          style={[
            styles.sidebarOption,
            selectedOption.name === option.name && styles.selectedSidebarOption
          ]}
          onPress={() => setSelectedOption(option)}
        >
          <Text style={[
            styles.sidebarOptionText,
            selectedOption.name === option.name && styles.selectedSidebarOptionText
          ]}>
            {option.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCategoryGrid = () => (
    <ScrollView style={styles.categoryGrid}>
      <View style={styles.gridContainer}>
        {selectedOption.subcategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryItem}
            onPress={() => navigation.navigate('CategoryProductList', {
              category: selectedOption.name,
              subcategory: category
            })}
          >
            <Avatar.Text
              size={40}
              label={category.substring(0, 2)}
              style={styles.avatar}
            />
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        {selectedTab === 'category' && (
          <>
            {renderSidebar()}
            {renderCategoryGrid()}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: HandyColors.primary40,
    padding: 16,
    paddingBottom: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
    marginRight: 8,
  },
  cartButton: {
    margin: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    maxWidth: 60,
    fontSize: 16
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: HandyColors.primary90,
  },
  tabText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  selectedTabText: {
    color: HandyColors.primary90,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 120,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  sidebarOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedSidebarOption: {
    backgroundColor: 'white',
    borderLeftWidth: 3,
    borderLeftColor: HandyColors.primary40,
  },
  sidebarOptionText: {
    fontSize: 14,
    color: '#666',
  },
  selectedSidebarOptionText: {
    color: HandyColors.primary40,
    fontWeight: '600',
  },
  categoryGrid: {
    flex: 1,
    backgroundColor: 'white',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  categoryItem: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: HandyColors.primary40,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
});

export default CategoryScreen;
