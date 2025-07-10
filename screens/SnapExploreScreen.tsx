import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import SnapPostCard from '../components/SnapPostCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ModalStackParamList } from '../src/navigation/modalStack';
import axiosInstance from '../src/api/axios';
import { Snap, SnapListResponse, Pagination } from '../src/types/snap';
import { useIsFocused } from '@react-navigation/native';
import { useUser } from '../src/context/UserContext';

type Props = NativeStackScreenProps<ModalStackParamList, 'SnapExplore'>;

const SnapExploreScreen: React.FC<Props> = ({ route }) => {
  const { initialSnapId, userId } = route.params;
  const isFocused = useIsFocused();
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const { userData } = useUser();

  const fetchSnaps = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = userId ? `/snap/list?userId=${userId}` : '/snap/list';
      const response = await axiosInstance.get(endpoint);
      const responseData: SnapListResponse = response.data;
      setSnaps(responseData.data);
      setPagination(responseData.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching snaps:', error);
      setError('데이터를 가져오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchSnaps();
    }
  }, [initialSnapId, userId, isFocused]);

  const handleFollow = useCallback((snapId: number) => {
    console.log('Follow snap:', snapId);
  }, []);

  const handleReport = useCallback((snapId: number) => {
    console.log('Report snap:', snapId);
  }, []);

  const handleLike = useCallback((snapId: number) => {
    console.log('Like snap:', snapId);
  }, []);

  const handleShare = useCallback((snapId: number) => {
    console.log('Share snap:', snapId);
  }, []);

  const handleComment = useCallback((snapId: number) => {
    console.log('Comment snap:', snapId);
  }, []);

  const renderSnapPost = ({ item }: { item: Snap }) => (
    <SnapPostCard
      snapId={item.id}
      profileImage={item.userProfileImage || require('../assets/images/nail1.png')}
      username={item.userName}
      contentImage={item.images[0]}
      userId={item.userId}
      content={item.content}
      isLiked={item.liked}
      likeCount={item.likeCount}
      commentCount={item.commentCount || 0}
      onFollow={() => handleFollow(item.id)}
      onReport={() => handleReport(item.id)}
      onLike={() => handleLike(item.id)}
      onShare={() => handleShare(item.id)}
      onComment={() => handleComment(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
      <FlatList
        data={snaps}
        renderItem={renderSnapPost}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={3}
      />
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
});

export default SnapExploreScreen;
 