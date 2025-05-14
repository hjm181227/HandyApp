import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, Searchbar } from "react-native-paper";
import HandyColors from "../../colors";
import ItemScrollBanner from "../components/item-scroll-banner";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [ searchQuery, setSearchQuery ] = React.useState('');
  const tabList = [ 'recommend', 'ranking', 'sale', 'brand', 'new', 'brand_coupon', 'weekly' ];
  const [ selectedTab, setSelectedTab ] = React.useState(tabList[0]);
  const tabNames = {
    recommend: '추천',
    ranking: '랭킹',
    sale: '세일',
    brand: '브랜드',
    new: '신상',
    brand_coupon: '브랜드 쿠폰',
    weekly: '핸디 위크'
  }
  const recommendItems = Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    name: `${index}번 상품`,
    price: index * 1000,
    imageUrl: ''
  }))

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.topBar}>
          <Text style={{ color: 'white', fontSize: 24 }}>Handy</Text>
          <View style={styles.actionButtons}>
            <Icon source={'bell-outline'} size={22} color={'white'}/>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
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
            data={tabList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  selectedTab === item && styles.selectedTab,
                ]}
                onPress={() => setSelectedTab(item)}
              >
                <Text style={[ styles.tabText, selectedTab === item && styles.selectedText ]}>
                  {tabNames[item]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.contentSection}>
        {/* 스크롤 영역 */}
        <View style={styles.imageBanner}>
          <TouchableOpacity
            activeOpacity={ 0.75 }
            style={ styles.banner }
          >
            <Image
              style={ styles.image }
              resizeMode='contain'
              source={ require('../../assets/images/banner.png') }
            />
          </TouchableOpacity>
        </View>
        <ItemScrollBanner items={recommendItems} title={'추천 상품'}></ItemScrollBanner>
        <ItemScrollBanner items={recommendItems} title={'베스트 셀러'}></ItemScrollBanner>
      </ScrollView>
    </SafeAreaView>
  )
};

export default HomeScreen;

const styles = StyleSheet.create({
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
    paddingVertical: 4
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
  selectedTab: {
    color: HandyColors.primary90,
    borderBottomWidth: 3,
    paddingBottom: 8,
    borderBottomColor: HandyColors.primary90
  },
  tabText: {
    fontSize: 14,
    paddingVertical: 4,
    color: 'white',
    fontWeight: 'bold',

  },
  selectedText: {
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
    // backgroundColor: 'orange',
    position: 'relative',
  },
  image: {
    flex: 1
  }
});
