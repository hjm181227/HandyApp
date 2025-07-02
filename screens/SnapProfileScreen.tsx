import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ModalStackParamList } from '../src/navigation/modalStack';
import axiosInstance from '../src/api/axios';
import { Snap, SnapListResponse, Pagination } from '../src/types/snap';

type Props = NativeStackScreenProps<ModalStackParamList, 'SnapProfile'>;

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;
const ITEM_HEIGHT = (ITEM_WIDTH * 5) / 4;

interface UserInfo {
  id: string;
  username: string;
  profileImage: string;
  followerCount: number;
  followingCount: number;
}

const SnapProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 사용자 정보 가져오기 (실제 API 엔드포인트로 수정 필요)
        const userResponse = await axiosInstance.get(`/users/${userId}/snap-profile`);
        setUserInfo(userResponse.data);

        // 사용자의 스냅 목록 가져오기
        const postsResponse = await axiosInstance.get(`/snap/list?userId=${userId}`);
        const responseData: SnapListResponse = postsResponse.data;
        setPosts(responseData.data);
        setPagination(responseData.pagination);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('데이터를 가져오는 중 오류가 발생했습니다.');

        setPagination({
          page: 0,
          size: 10,
          totalElements: 30,
          totalPages: 3,
          hasNext: false,
          hasPrevious: false,
          isFirst: true,
          isLast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const renderHeader = () => (
    <View style={styles.header}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.headerTitle}>{userInfo?.username || '프로필'}</Text>
      <IconButton
        icon="dots-vertical"
        size={24}
        onPress={() => {}}
      />
    </View>
  );

  const renderProfileInfo = () => {
    if (!userInfo) return null;

    return (
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: userInfo.profileImage }}
          style={styles.profileImage}
        />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pagination?.totalElements}</Text>
            <Text style={styles.statLabel}>게시글</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.followerCount}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.followingCount}</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>팔로우</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSnapGrid = () => (
    <View style={styles.imageGrid}>
      {posts.map((snap) => (
        <TouchableOpacity
          key={snap.id}
          style={styles.imageContainer}
          onPress={() => {
            navigation.navigate('SnapExplore', { 
              initialSnapId: snap.id,
              userId: userId 
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        {renderProfileInfo()}
        <View style={styles.postsContainer}>
          {renderSnapGrid()}
        </View>
      </ScrollView>
    </View>
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsContainer: {
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
  },
});

export default SnapProfileScreen;
