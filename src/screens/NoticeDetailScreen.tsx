import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NoticeStackParamList } from '../navigation/noticeStack';
import HandyColors from "../../colors";

type NoticeDetailScreenNavigationProp = StackNavigationProp<NoticeStackParamList, 'NoticeDetail'>;
type NoticeDetailScreenRouteProp = RouteProp<NoticeStackParamList, 'NoticeDetail'>;

const NoticeDetailScreen = () => {
  const navigation = useNavigation<NoticeDetailScreenNavigationProp>();
  const route = useRoute<NoticeDetailScreenRouteProp>();
  const { notice } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>공지사항</Text>
        <View style={styles.headerRight} />
      </View>

      <Divider />

      {/* Notice Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Notice Header Info */}
        <View style={styles.noticeHeader}>
          <View style={styles.noticeIdContainer}>
            <Text style={styles.noticeId}>#{notice.noticeId}</Text>
          </View>
          <Text style={styles.noticeDate}>{notice.createdAt}</Text>
        </View>

        {/* Notice Title */}
        <Text style={styles.noticeTitle}>{notice.title}</Text>

        <Divider style={styles.divider} />

        {/* Notice Content */}
        <View style={styles.contentSection}>
          <Text style={styles.contentText}>
            {notice.content}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            더 궁금한 점이 있으시면 고객센터로 문의해 주세요.
          </Text>
        </View>
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
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  noticeIdContainer: {
    backgroundColor: HandyColors.primary10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  noticeId: {
    fontSize: 14,
    color: HandyColors.primary90,
    fontWeight: '600',
  },
  noticeDate: {
    fontSize: 14,
    color: HandyColors.grayLight,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  contentSection: {
    marginBottom: 32,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    color: HandyColors.grayLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default NoticeDetailScreen;
