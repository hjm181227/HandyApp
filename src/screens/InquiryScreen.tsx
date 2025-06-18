import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../navigation/myPageStack';
import HandyColors from "../../colors";

type InquiryScreenNavigationProp = StackNavigationProp<MyPageStackParamList, 'Inquiry'>;

const InquiryScreen = () => {
  const navigation = useNavigation<InquiryScreenNavigationProp>();
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  const supportEmail = 'hermosear98@gmail.com';

  const faqs = [
    {
      question: '배송 언제까지 가능한가요?',
      answer: '결제일로부터 제작 기간에 따라 1~2주정도 소요됩니다!'
    },
    {
      question: '정말 재사용이 가능한가요?',
      answer: '제품 자체의 손상이 아니라면 반영구적으로 사용 가능합니다. 하지만 글루 사용 시 재사용에 제한적일 수 있습니다.'
    },
    {
      question: '환불 교환 규정은 어떻게 되나요?',
      answer: '수제품이라는 특성 상 배송과정에서 제품 파손등이 아니라면 환불 교환은 힘드십니다.'
    },
    {
      question: '안떨어지면 계속 유지되나요?',
      answer: '생활하시며 물이 들어가게 되어있어서 손톱 손상이 일어날 수 있어요. 최소한 3일차에는 제거하시길 추천드립니다.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>고객센터</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Operating Hours */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>운영시간</Text>
            <Text style={styles.cardText}>평일 10:00 - 18:00</Text>
            <Text style={styles.cardText}>주말 및 공휴일 휴무</Text>
            <Text style={styles.cardText}>점심시간 12:00 - 13:00</Text>
          </Card.Content>
        </Card>

        {/* Contact */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>이메일 문의</Text>
            <Text style={styles.cardText}>{supportEmail}</Text>
            <Text style={styles.cardSubText}>문의하신 내용은 24시간 이내에 답변 드립니다.</Text>
          </Card.Content>
        </Card>

        {/* FAQ */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>자주 묻는 질문</Text>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQ(index)}
                >
                  <Text style={styles.questionText}>Q. {faq.question}</Text>
                  <IconButton
                    icon={expandedFAQs.includes(index) ? "chevron-up" : "chevron-down"}
                    size={20}
                  />
                </TouchableOpacity>
                {expandedFAQs.includes(index) && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answerText}>A. {faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
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
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  answerContainer: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default InquiryScreen;
