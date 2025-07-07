import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageURISource, Alert } from 'react-native';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ModalStackParamList } from '../src/navigation/modalStack';
import axiosInstance from '../src/api/axios';
import CommentModal from './CommentModal';
import { useUser } from '../src/context/UserContext';
import ReportSnapModal from '../src/components/ReportSnapModal';
import { ReportReason } from '../src/api/report';

type NavigationProp = NativeStackNavigationProp<ModalStackParamList>;

interface SnapPostCardProps {
  snapId: number;
  profileImage: string | any;
  username: string;
  contentImage: string | any;
  userId: number;
  content?: string;
  isLiked?: boolean;
  likeCount?: number | string;
  commentCount?: number;
  onFollow?: () => void;
  onReport?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

const SnapPostCard: React.FC<SnapPostCardProps> = ({
  snapId,
  profileImage,
  username,
  contentImage,
  userId,
  content,
  isLiked: initialIsLiked = false,
  likeCount: initialLikeCount = 0,
  commentCount = 0,
  onFollow,
  onReport,
  onLike,
  onShare,
  onComment,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useUser();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(typeof initialLikeCount === 'number' ? initialLikeCount : Number(initialLikeCount) || 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      setIsMounted(false);
      setIsLiked(false);
    };
  }, []);

  // API에서 받은 초기값으로 상태 업데이트
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(typeof initialLikeCount === 'number' ? initialLikeCount : Number(initialLikeCount) || 0);
  }, [initialIsLiked, initialLikeCount]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('SnapProfile', { userId });
  }, [navigation, userId]);

  const handleLike = useCallback(async () => {
    if (!isMounted) return;
    // optimistic update
    setIsLiked(prev => {
      const newLiked = !prev;
      setLikeCount(prevCount => newLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
      return newLiked;
    });
    onLike?.();
    try {
      await axiosInstance.post(`/snap/${snapId}/likes`);
    } catch (error) {
      // rollback on error
      setIsLiked(prev => {
        const newLiked = !prev;
        setLikeCount(prevCount => newLiked ? prevCount + 1 : Math.max(0, prevCount - 1));
        return newLiked;
      });
      // TODO: show error toast/snackbar if needed
    }
  }, [isMounted, onLike, snapId]);

  const handleComment = useCallback(() => {
    if (!isMounted) return;
    setShowCommentModal(true);
    onComment?.();
  }, [isMounted, onComment]);

  const handleCloseCommentModal = useCallback(() => {
    setShowCommentModal(false);
  }, []);

  const handleFollow = useCallback(() => {
    if (!isMounted) return;
    onFollow?.();
  }, [isMounted, onFollow]);

  const handleReportSnap = async (reason: ReportReason, content: string) => {
    setReportError(null);
    setReportLoading(true);
    try {
      await axiosInstance.post('/reports', {
        targetId: snapId,
        targetType: 'SNAP',
        reason,
        content,
      });
      setShowReportModal(false);
      Alert.alert('신고 완료', '게시글이 신고되었습니다.');
    } catch (error: any) {
      console.error('Error reporting snap:', error);
      setReportError(error?.response?.data?.message || '신고를 처리할 수 없습니다.');
    } finally {
      setReportLoading(false);
    }
  };

  const handleReport = useCallback(() => {
    if (!isMounted) return;
    setShowReportModal(true);
    onReport?.();
  }, [isMounted, onReport]);

  const handleShare = useCallback(() => {
    if (!isMounted) return;
    onShare?.();
  }, [isMounted, onShare]);

  const getImageSource = (image: string | any) => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  const isOwnPost = userData?.id === userId;

  return (
    <>
      <View style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileInfo}
            onPress={handleProfilePress}
          >
            <Image
              source={getImageSource(profileImage)}
              style={styles.profileImage}
              onLoadStart={() => {
                if (!isMounted) return;
              }}
              onLoadEnd={() => {
                if (!isMounted) return;
              }}
            />
            <Text style={styles.username}>{username}</Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            {!isOwnPost && (
              <TouchableOpacity
                onPress={handleFollow}
                style={styles.followButton}
                activeOpacity={0.7}
              >
                <Text style={styles.followButtonText}>팔로우</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleReport}
              style={styles.reportButton}
              activeOpacity={0.7}
            >
              <Icon source="flag-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Image
            source={getImageSource(contentImage)}
            style={styles.contentImage}
            resizeMode="cover"
            onLoadStart={() => {
              if (!isMounted) return;
            }}
            onLoadEnd={() => {
              if (!isMounted) return;
            }}
          />
        </View>

        {/* Interaction Section */}
        <View style={styles.interactionSection}>
          <View style={styles.interactionButtons}>
            <TouchableOpacity
              onPress={handleLike}
              style={styles.interactionButton}
              activeOpacity={0.7}
            >
              <Icon
                source={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#FF6B6B" : "#333"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleComment}
              style={styles.interactionButton}
              activeOpacity={0.7}
            >
              <Icon source="comment-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.interactionButton}
              activeOpacity={0.7}
            >
              <Icon source="share-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Like Count Section */}
        {likeCount > 0 && (
          <View style={styles.likeCountSection}>
            <Text style={styles.likeCountText}>좋아요 {likeCount}개</Text>
          </View>
        )}

        {/* Content Section */}
        {content && (
          <View style={styles.contentTextSection}>
            <Text style={styles.contentText} numberOfLines={3}>{content}
            </Text>
          </View>
        )}

        {/* Comment Preview Section */}
        <View style={styles.commentPreviewSection}>
          {commentCount > 0 ? (
            <>
              <TouchableOpacity
                style={styles.viewMoreComments}
                onPress={handleComment}
              >
                <Text style={styles.viewMoreText}>댓글 더 보기</Text>
              </TouchableOpacity>
              <View style={styles.firstComment}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentUsername}>사용자1</Text> 정말 예쁘네요!
                </Text>
              </View>
            </>
          ) : null}
          <TouchableOpacity
            style={styles.commentInputPreview}
            onPress={handleComment}
          >
            <Image
              source={require('../assets/images/nail1.png')}
              style={styles.userProfileImage}
            />
            <Text style={styles.commentPlaceholder}>
              {commentCount > 0 ? '댓글을 남겨주세요.' : '첫 댓글을 남겨주세요.'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comment Modal */}
        <CommentModal
          visible={showCommentModal}
          snapId={snapId}
          commentCount={commentCount}
          onClose={handleCloseCommentModal}
        />
      </View>

      {/* Report Modal */}
      <ReportSnapModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSnap}
        loading={reportLoading}
        error={reportError}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  reportButton: {
    padding: 4,
  },
  contentSection: {
    width: '100%',
    height: 400,
  },
  contentImage: {
    width: '100%',
    height: '100%',
  },
  interactionSection: {
    padding: 12,
  },
  interactionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionButton: {
    marginRight: 16,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCountSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likeCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  contentTextSection: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentPreviewSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewMoreComments: {
    marginBottom: 4,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  firstComment: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  commentUsername: {
    fontWeight: '600',
    color: '#333',
  },
  commentInputPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  userProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
});

export default React.memo(SnapPostCard);
