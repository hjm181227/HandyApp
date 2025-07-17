import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NoticeStackParamList } from '../navigation/noticeStack';
import HandyColors from "../../colors";
import { getNoticeList } from '../api/notice';
import { Notice } from '../types/notice';

type NoticeListScreenNavigationProp = StackNavigationProp<NoticeStackParamList, 'NoticeList'>;

const NoticeListScreen = () => {
  const navigation = useNavigation<NoticeListScreenNavigationProp>();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);

        // 실제 API 호출
        const response = await getNoticeList();

        // 실제 API 호출 시뮬레이션
        setTimeout(() => {
          setNotices(response.data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleNoticePress = (notice: Notice) => {
    navigation.navigate('NoticeDetail', { notice });
  };

  const renderNoticeItem = ({ item }: { item: Notice }) => (
    <TouchableOpacity
      style={styles.noticeItem}
      onPress={() => handleNoticePress(item)}
    >
      <View style={styles.noticeHeader}>
        <Text style={styles.noticeId}>#{item.noticeId}</Text>
        <Text style={styles.noticeDate}>{item.createdAt}</Text>
      </View>
      <Text style={styles.noticeTitle} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={HandyColors.primary90} />
        <Text style={styles.loadingText}>공지사항을 불러오는 중...</Text>
      </View>
    );
  }

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

      {/* Notice List */}
      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={(item) => item.noticeId}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 80, // 각 아이템의 예상 높이
          offset: 80 * index,
          index,
        })}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: HandyColors.grayLight,
  },
  listContainer: {
    paddingBottom: 20,
  },
  noticeItem: {
    padding: 16,
    backgroundColor: '#fff',
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noticeId: {
    fontSize: 14,
    color: HandyColors.primary90,
    fontWeight: '600',
  },
  noticeDate: {
    fontSize: 12,
    color: HandyColors.grayLight,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: '#333',
  },
});

export default NoticeListScreen;
