import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { IconButton, Icon } from 'react-native-paper';
import axiosInstance from '../src/api/axios';

interface Comment {
  id: number;
  content: string;
  userName: string;
  userProfileImage: string | null;
  createdAt: string;
}

interface CommentModalProps {
  visible: boolean;
  snapId: number;
  commentCount: number;
  onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  snapId,
  commentCount,
  onClose,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchComments();
    }
  }, [visible, snapId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/snap/${snapId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Mock data for now
      setComments([
        {
          id: 1,
          content: '정말 예쁘네요!',
          userName: '사용자1',
          userProfileImage: null,
          createdAt: '2025-01-01T12:00:00',
        },
        {
          id: 2,
          content: '어디서 하셨나요?',
          userName: '사용자2',
          userProfileImage: null,
          createdAt: '2025-01-01T12:30:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axiosInstance.post(`/snap/${snapId}/comments`, {
        content: newComment,
      });
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('오류', '댓글을 등록할 수 없습니다.');
    }
  };

  const handleReportComment = (commentId: number) => {
    Alert.alert(
      '댓글 신고',
      '이 댓글을 신고하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '신고',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosInstance.post(`/comments/${commentId}/report`);
              Alert.alert('신고 완료', '댓글이 신고되었습니다.');
            } catch (error) {
              console.error('Error reporting comment:', error);
              Alert.alert('오류', '신고를 처리할 수 없습니다.');
            }
          },
        },
      ]
    );
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.commentUserInfo}>
          <Image
            source={
              item.userProfileImage
                ? { uri: item.userProfileImage }
                : require('../assets/images/nail1.png')
            }
            style={styles.commentUserImage}
          />
          <Text style={styles.commentUserName}>{item.userName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleReportComment(item.id)}
          style={styles.reportButton}
        >
          <Icon source="dots-vertical" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>댓글 ({commentCount})</Text>
          <IconButton icon="close" size={24} onPress={onClose} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => String(item.id)}
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <Image
            source={require('../assets/images/nail1.png')}
            style={styles.userImage}
          />
          <TextInput
            style={styles.input}
            placeholder="댓글을 남겨주세요."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            <Text style={[styles.sendButtonText, !newComment.trim() && styles.sendButtonTextDisabled]}>
              게시
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  reportButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
});

export default CommentModal; 