import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageURISource } from 'react-native';
import { Icon } from 'react-native-paper';

interface SnapPostCardProps {
  profileImage: string;
  username: string;
  contentImage: string;
  onFollow?: () => void;
  onReport?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

const SnapPostCard: React.FC<SnapPostCardProps> = ({
  profileImage,
  username,
  contentImage,
  onFollow,
  onReport,
  onLike,
  onShare,
  onComment,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
      // 상태 초기화
      setIsLiked(false);
      setShowComments(false);
    };
  }, []);

  const handleLike = useCallback(() => {
    if (!isMounted) return;
    setIsLiked(prev => !prev);
    onLike?.();
  }, [isMounted, onLike]);

  const handleComment = useCallback(() => {
    if (!isMounted) return;
    setShowComments(prev => !prev);
    onComment?.();
  }, [isMounted, onComment]);

  const handleFollow = useCallback(() => {
    if (!isMounted) return;
    onFollow?.();
  }, [isMounted, onFollow]);

  const handleReport = useCallback(() => {
    if (!isMounted) return;
    onReport?.();
  }, [isMounted, onReport]);

  const handleShare = useCallback(() => {
    if (!isMounted) return;
    onShare?.();
  }, [isMounted, onShare]);

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <Image
            source={require('../assets/images/nail1.png')}
            style={styles.profileImage}
            onLoadStart={() => {
              if (!isMounted) return;
            }}
            onLoadEnd={() => {
              if (!isMounted) return;
            }}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={handleFollow} 
            style={styles.followButton}
            activeOpacity={0.7}
          >
            <Text style={styles.followButtonText}>팔로우</Text>
          </TouchableOpacity>
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
      <Image
        source={require('../assets/images/nail1.png')}
        style={styles.contentImage}
        onLoadStart={() => {
          if (!isMounted) return;
        }}
        onLoadEnd={() => {
          if (!isMounted) return;
        }}
      />

      {/* Interaction Buttons */}
      <View style={styles.interactionSection}>
        <TouchableOpacity 
          onPress={handleLike} 
          style={styles.interactionButton}
          activeOpacity={0.7}
        >
          <Icon
            source={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#ff3b30' : '#000'}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleShare} 
          style={styles.interactionButton}
          activeOpacity={0.7}
        >
          <Icon source="share-variant" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleComment} 
          style={styles.interactionButton}
          activeOpacity={0.7}
        >
          <Icon source="comment-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Comments Section (to be implemented) */}
      {showComments && (
        <View style={styles.commentsSection}>
          {/* Comments will be implemented here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
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
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  reportButton: {
    padding: 4,
  },
  contentImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  interactionSection: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  interactionButton: {
    marginRight: 16,
  },
  commentsSection: {
    padding: 12,
  },
});

export default React.memo(SnapPostCard);
