import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import SnapPostCard from '../components/SnapPostCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SnapStackParamList } from '../src/navigation/snapStack';

type Props = NativeStackScreenProps<SnapStackParamList, 'SnapExplore'>;

interface Snap {
  id: string;
  profileImage: string;
  username: string;
  contentImage: string;
}

const SnapExploreScreen: React.FC<Props> = ({ route }) => {
  const { initialSnapId } = route.params;
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSnaps = async () => {
      try {
        // 실제 API 호출로 대체 필요
        const mockSnaps: Snap[] = [
          {
            id: String(initialSnapId),
            profileImage: 'https://picsum.photos/200',
            username: '사용자1',
            contentImage: 'https://picsum.photos/400/600',
          },
          {
            id: '2',
            profileImage: 'https://picsum.photos/201',
            username: '사용자2',
            contentImage: 'https://picsum.photos/400/601',
          },
          {
            id: '3',
            profileImage: 'https://picsum.photos/202',
            username: '사용자3',
            contentImage: 'https://picsum.photos/400/602',
          },
        ];

        if (isMounted) {
          setSnaps(mockSnaps);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching snaps:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSnaps();

    return () => {
      isMounted = false;
    };
  }, [initialSnapId]);

  const handleFollow = useCallback((snapId: string) => {
    console.log('Follow snap:', snapId);
  }, []);

  const handleReport = useCallback((snapId: string) => {
    console.log('Report snap:', snapId);
  }, []);

  const handleLike = useCallback((snapId: string) => {
    console.log('Like snap:', snapId);
  }, []);

  const handleShare = useCallback((snapId: string) => {
    console.log('Share snap:', snapId);
  }, []);

  const handleComment = useCallback((snapId: string) => {
    console.log('Comment on snap:', snapId);
  }, []);

  const renderItem = useCallback(({ item }: { item: Snap }) => (
    <SnapPostCard
      profileImage={item.profileImage}
      username={item.username}
      contentImage={item.contentImage}
      onFollow={() => handleFollow(item.id)}
      onReport={() => handleReport(item.id)}
      onLike={() => handleLike(item.id)}
      onShare={() => handleShare(item.id)}
      onComment={() => handleComment(item.id)}
    />
  ), [handleFollow, handleReport, handleLike, handleShare, handleComment]);

  const keyExtractor = useCallback((item: Snap) => item.id, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={snaps}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        snapToInterval={400}
        decelerationRate="fast"
        snapToAlignment="start"
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={3}
        initialNumToRender={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SnapExploreScreen;
