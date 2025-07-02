import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SnapStackParamList } from '../navigation/snapStack';
import { useUser } from "../context/UserContext";
import axiosInstance from '../api/axios';
import { Snap, SnapListResponse } from '../types/snap';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;
const ITEM_HEIGHT = (ITEM_WIDTH * 5) / 4;

type SnapPageNavigationProp = NativeStackNavigationProp<SnapStackParamList, 'SnapMain'>;

const SnapPage = () => {
  const theme = useTheme();
  const { userData } = useUser();
  const navigation = useNavigation<SnapPageNavigationProp>();
  const [activeTab, setActiveTab] = useState('discover');
  const [activeFilter, setActiveFilter] = useState('all');
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnaps = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/snap/list');
        const responseData: SnapListResponse = response.data;
        setSnaps(responseData.data);
      } catch (error) {
        console.error('Error fetching snaps:', error);
        // API 실패 시 빈 배열로 설정
        setSnaps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSnaps();
  }, []);

  const handleProfilePress = () => {
    navigation.getParent()?.navigate('ModalStack', {
      screen: 'SnapProfile',
      params: { userId: userData?.id || 1 },
    });
  };

  const tabs = [
    { id: 'discover', label: '발견' },
    { id: 'following', label: '팔로잉' },
  ];
  const filters = ['all', 'new', 'popular', 'trending', 'following'];

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={require('../../assets/images/logo-snap.png')}
        style={styles.logo}
        resizeMode="cover"
      />
      <View style={styles.headerButtons}>
        {/*<IconButton icon="bell-outline" size={24} onPress={() => {}} />*/}
        <IconButton icon="magnify" size={24} onPress={() => {}} />
        <IconButton
          icon="account-circle-outline"
          size={24}
          onPress={handleProfilePress}
        />
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
          ]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      style={styles.filtersContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            activeFilter === filter && styles.activeFilterButton,
          ]}
          onPress={() => setActiveFilter(filter)}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText,
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSnapGrid = () => (
    <View style={styles.imageGrid}>
      {snaps.map((snap) => (
        <TouchableOpacity
          key={snap.id}
          style={styles.imageContainer}
          onPress={() => {
            // @ts-ignore - ModalStack으로 이동하기 위해 임시로 타입 무시
            navigation.getParent()?.navigate('ModalStack', {
              screen: 'SnapExplore',
              params: { initialSnapId: snap.id }
            });
          }}
        >
          <Image
            source={{ uri: snap.images[0] }}
            style={styles.image}
          />
          <IconButton
            icon="heart-outline"
            size={24}
            style={styles.likeButton}
            iconColor={'white'}
            onPress={() => {}}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      {/*{renderFilters()}*/}
      <ScrollView style={styles.content}>
        {renderSnapGrid()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logo: {
    width: 80,
    height: 40,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  filtersContainer: {
    paddingVertical: 8,
    height: 60,
    display: 'flex',
    overflow: 'scroll'
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    height: 'auto',
  },
  activeFilterButton: {
    backgroundColor: '#000',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default SnapPage;
