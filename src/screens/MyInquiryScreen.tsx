import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HandyColors, { colors } from '../../colors';

type Inquiry = {
  id: string;
  title: string;
  date: string;
  content: string;
  isAnswered: boolean;
  answer?: {
    content: string;
    date: string;
  };
};

const MyInquiryScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const handleBack = () => {
    if (selectedInquiry) {
      setSelectedInquiry(null);
    } else {
      navigation.goBack();
    }
  };

  const handleTabChange = (tab: 'create' | 'history') => {
    if (selectedInquiry) {
      setSelectedInquiry(null);
    }
    setActiveTab(tab);
  };

  // 임시 데이터
  const inquiries: Inquiry[] = [
    {
      id: '1',
      title: '배송 문의드립니다',
      date: '2024.03.20',
      content: '주문한 상품이 아직 도착하지 않았습니다. 배송 상태를 확인해주세요.',
      isAnswered: true,
      answer: {
        content: '안녕하세요. 문의하신 주문건은 현재 배송 중이며, 내일(3/21) 오후까지 도착 예정입니다. 불편을 드려 죄송합니다.',
        date: '2024.03.20'
      }
    },
    {
      id: '2',
      title: '상품 사이즈 문의',
      date: '2024.03.18',
      content: '제 손톱 사이즈가 12mm인데 어떤 사이즈를 주문해야 할까요?',
      isAnswered: false
    },
    {
      id: '3',
      title: '환불 관련 문의',
      date: '2024.03.15',
      content: '상품이 마음에 들지 않아 환불을 신청하고 싶습니다. 절차를 알려주세요.',
      isAnswered: true,
      answer: {
        content: '환불 신청은 마이페이지 > 주문내역에서 해당 상품을 선택하신 후 "환불 신청" 버튼을 클릭하시면 됩니다. 상품 수령 후 7일 이내에 신청 가능합니다.',
        date: '2024.03.15'
      }
    },
  ];

  const handleSubmit = () => {
    // TODO: 문의하기 API 연동
    console.log('Submit inquiry:', { title, content });
  };

  const renderInquiryItem = ({ item }: { item: Inquiry }) => (
    <TouchableOpacity
      style={styles.inquiryItem}
      onPress={() => setSelectedInquiry(item)}
    >
      <View style={styles.inquiryHeader}>
        <View style={styles.inquiryHeaderLeft}>
          <Text style={styles.inquiryId}>#{item.id}</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot,
              { backgroundColor: item.isAnswered ? colors.success : colors.error }
            ]} />
            <Text style={[
              styles.statusText,
              { color: item.isAnswered ? colors.success : colors.error }
            ]}>
              {item.isAnswered ? '답변완료' : '답변대기'}
            </Text>
          </View>
        </View>
        <Text style={styles.inquiryDate}>{item.date}</Text>
      </View>
      <Text style={styles.inquiryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>1:1 문의</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'create' && styles.activeTab]}
          onPress={() => handleTabChange('create')}
        >
          <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
            문의하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => handleTabChange('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            문의내역
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'create' ? (
        <ScrollView style={styles.contentContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력해주세요"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="문의 내용을 입력해주세요"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[styles.submitButton, (!title || !content) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title || !content}
          >
            <Text style={styles.submitButtonText}>문의하기</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <FlatList
          data={inquiries}
          renderItem={renderInquiryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyContainer}
          removeClippedSubviews={false}
        />
      )}

      <Modal
        visible={selectedInquiry !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedInquiry(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>문의 상세</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setSelectedInquiry(null)}
              />
            </View>
            {selectedInquiry && (
              <>
                <View style={styles.modalInfo}>
                  <View style={styles.modalInfoLeft}>
                    <Text style={styles.modalId}>#{selectedInquiry.id}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: selectedInquiry.isAnswered ? colors.success : colors.error }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: selectedInquiry.isAnswered ? colors.success : colors.error }
                      ]}>
                        {selectedInquiry.isAnswered ? '답변완료' : '답변대기'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.modalDate}>{selectedInquiry.date}</Text>
                </View>
                <Text style={styles.modalInquiryTitle}>{selectedInquiry.title}</Text>
                <ScrollView style={styles.modalInquiryContent}>
                  <Text style={styles.modalInquiryText}>{selectedInquiry.content}</Text>

                  {selectedInquiry.isAnswered && selectedInquiry.answer && (
                    <View style={styles.answerContainer}>
                      <View style={styles.answerHeader}>
                        <Text style={styles.answerTitle}>답변</Text>
                        <Text style={styles.answerDate}>{selectedInquiry.answer.date}</Text>
                      </View>
                      <Text style={styles.answerText}>{selectedInquiry.answer.content}</Text>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.text,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  contentInput: {
    height: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 16,
  },
  inquiryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inquiryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inquiryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inquiryId: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  inquiryDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inquiryTitle: {
    fontSize: 16,
    color: colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalId: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 8,
  },
  modalDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalInquiryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  modalInquiryContent: {
    maxHeight: 300,
  },
  modalInquiryText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});

export default MyInquiryScreen;
