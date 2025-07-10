import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import axiosInstance from '../src/api/axios';

export interface CommentProps {
  id: number;
  snapId: number;
  content: string;
  userName: string;
  userProfileImage: string | null;
  createdAt: string;
  replies?: CommentProps[]; // 답글 배열 추가
  onReport: (commentId: number) => void;
  onReplyAdded?: () => void;
}

const CommentComponent: React.FC<CommentProps> = ({
  id,
  snapId,
  content,
  userName,
  userProfileImage,
  createdAt,
  replies = [],
  onReport,
  onReplyAdded,
}) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);
      await axiosInstance.post(`/comments/snap/${snapId}`, {
        content: replyText,
        parentId: id, // 부모 댓글 ID 추가
      });
      setReplyText('');
      setShowReplyModal(false);
      onReplyAdded?.();
      Alert.alert('성공', '답글이 등록되었습니다.');
    } catch (error) {
      console.error('Error posting reply:', error);
      Alert.alert('오류', '답글을 등록할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!reportReason) {
      Alert.alert('알림', '신고 사유를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/reports', {
        targetId: id,
        targetType: 'COMMENT',
        reason: reportReason,
        content: reportContent,
      });
      setShowReportModal(false);
      setReportReason('');
      setReportContent('');
      Alert.alert('신고 완료', '댓글이 신고되었습니다.');
    } catch (error) {
      console.error('Error reporting comment:', error);
      Alert.alert('오류', '신고를 처리할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const reportReasons = [
    { key: 'SPAM', label: '스팸' },
    { key: 'INAPPROPRIATE', label: '부적절한 내용' },
    { key: 'HARASSMENT', label: '괴롭힘' },
    { key: 'VIOLENCE', label: '폭력적 내용' },
    { key: 'OTHER', label: '기타' },
  ];

  return (
    <>
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.commentUserInfo}>
          <Image
            source={userProfileImage ? { uri: userProfileImage } : require('../assets/images/nail1.png')}
            style={styles.commentUserImage}
          />
          <Text style={styles.commentUserName}>{userName}</Text>
        </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => setShowReplyModal(true)}
              style={styles.replyButton}
            >
              <Text style={styles.replyButtonText}>답글</Text>
            </TouchableOpacity>
        <TouchableOpacity
              onPress={() => setShowReportModal(true)}
          style={styles.reportButton}
        >
          <Icon source="dots-vertical" size={16} color="#666" />
        </TouchableOpacity>
          </View>
      </View>
      <Text style={styles.commentContent}>{content}</Text>
        
        {/* 답글 목록 */}
        {replies && replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map((reply) => (
              <View key={reply.id} style={styles.replyItem}>
                <View style={styles.replyHeader}>
                  <View style={styles.replyUserInfo}>
                    <Image
                      source={reply.userProfileImage ? { uri: reply.userProfileImage } : require('../assets/images/nail1.png')}
                      style={styles.replyUserImage}
                    />
                    <Text style={styles.replyUserName}>{reply.userName}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onReport(reply.id)}
                    style={styles.replyReportButton}
                  >
                    <Icon source="dots-vertical" size={14} color="#666" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.replyContent}>{reply.content}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 답글 입력 모달 */}
      <Modal
        visible={showReplyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReplyModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>답글 작성</Text>
            <IconButton icon="close" size={24} onPress={() => setShowReplyModal(false)} />
          </View>
          
          <View style={styles.replyPreview}>
            <Text style={styles.replyPreviewText}>
              <Text style={styles.replyPreviewUsername}>{userName}</Text>님에게 답글
            </Text>
            <Text style={styles.replyPreviewContent}>{content}</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="답글을 입력하세요..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.submitButton, !replyText.trim() && styles.submitButtonDisabled]}
              onPress={handleReply}
              disabled={!replyText.trim() || loading}
            >
              <Text style={[styles.submitButtonText, !replyText.trim() && styles.submitButtonTextDisabled]}>
                {loading ? '등록 중...' : '등록'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 신고 모달 */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>댓글 신고</Text>
            <IconButton icon="close" size={24} onPress={() => setShowReportModal(false)} />
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>신고 사유</Text>
            {reportReasons.map((reason) => (
              <TouchableOpacity
                key={reason.key}
                style={[
                  styles.reasonButton,
                  reportReason === reason.key && styles.reasonButtonSelected
                ]}
                onPress={() => setReportReason(reason.key)}
              >
                <Text style={[
                  styles.reasonButtonText,
                  reportReason === reason.key && styles.reasonButtonTextSelected
                ]}>
                  {reason.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.reportSection}>
            <Text style={styles.reportSectionTitle}>추가 설명 (선택사항)</Text>
            <TextInput
              style={styles.reportInput}
              placeholder="신고 사유에 대한 추가 설명을 입력하세요..."
              value={reportContent}
              onChangeText={setReportContent}
              multiline
              maxLength={200}
            />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reportSubmitButton, !reportReason && styles.reportSubmitButtonDisabled]}
              onPress={handleReport}
              disabled={!reportReason || loading}
            >
              <Text style={[styles.reportSubmitButtonText, !reportReason && styles.reportSubmitButtonTextDisabled]}>
                {loading ? '신고 중...' : '신고하기'}
              </Text>
            </TouchableOpacity>
          </View>
    </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyButton: {
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  replyButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  reportButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  replyPreview: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    margin: 16,
    borderRadius: 8,
  },
  replyPreviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  replyPreviewUsername: {
    fontWeight: '600',
    color: '#333',
  },
  replyPreviewContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  inputContainer: {
    padding: 16,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  reportSection: {
    padding: 16,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  reasonButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  reasonButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  reasonButtonText: {
    fontSize: 14,
    color: '#333',
  },
  reasonButtonTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  reportInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  reportSubmitButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  reportSubmitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  reportSubmitButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  reportSubmitButtonTextDisabled: {
    color: '#999',
  },
  repliesContainer: {
    marginTop: 8,
    marginLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 12,
  },
  replyItem: {
    marginBottom: 8,
    paddingVertical: 4,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  replyUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyUserImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  replyUserName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  replyReportButton: {
    padding: 2,
  },
  replyContent: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginLeft: 26,
  },
});

export default CommentComponent;
