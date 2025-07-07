import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ModalStackParamList } from '../src/navigation/modalStack';
import axiosInstance from '../src/api/axios';
import { Snap, SnapListResponse, Pagination } from '../src/types/snap';
import { useUser } from '../src/context/UserContext';
import { useIsFocused } from '@react-navigation/native';
import SnapPostCard from '../components/SnapPostCard';
import ReportSnapModal from '../src/components/ReportSnapModal';
import { reportSnap, ReportReason } from '../src/api/report';

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
  const { userData } = useUser();
  const { userId } = route.params;
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportTargetId, setReportTargetId] = useState<number | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // 현재 사용자와 프로필 주인의 ID 비교
  const isOwnProfile = userData?.id === userId;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const userResponse = await axiosInstance.get(`/users/${userId}/snap-profile`);
      setUserInfo(userResponse.data);
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

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [userId, isFocused]);

  const handleToggleLike = async (snapId: number, liked: boolean) => {
    try {
      await axiosInstance.post(`/snap/${snapId}/likes`);
      setPosts((prev) =>
        prev.map((snap) =>
          snap.id === snapId
            ? {
                ...snap,
                liked: !liked,
                likeCount: snap.liked ? snap.likeCount - 1 : snap.likeCount + 1,
              }
            : snap
        )
      );
    } catch (e) {
      // 에러 처리 (필요시 alert 등)
    }
  };

  const handleReportSnap = async (reason: ReportReason, content: string) => {
    if (!reportTargetId) return;
    setReportError(null);
    setReportLoading(true);
    try {
      await reportSnap(reportTargetId, reason, content);
      setReportModalVisible(false);
      Alert.alert('신고가 접수되었습니다.');
    } catch (error: any) {
      setReportError(error?.response?.data?.message || '신고에 실패했습니다.');
    } finally {
      setReportLoading(false);
    }
  };

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
        {!isOwnProfile && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>팔로우</Text>
          </TouchableOpacity>
        )}
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
            icon={snap.liked ? 'heart' : 'heart-outline'}
            size={24}
            style={styles.likeButton}
            iconColor={snap.liked ? 'red' : 'white'}
            onPress={() => handleToggleLike(snap.id, snap.liked)}
          />
          <IconButton
            icon="alert-circle-outline"
            size={24}
            style={[styles.likeButton, { right: 32 }]}
            iconColor={'#ff6b6b'}
            onPress={() => {
              setReportTargetId(snap.id);
              setReportModalVisible(true);
            }}
          />
        </TouchableOpacity>
      ))}
      <ReportSnapModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSnap}
        loading={reportLoading}
        error={reportError}
      />
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
