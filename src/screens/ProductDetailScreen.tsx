import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { colors } from '../../colors';
import { Icon } from 'react-native-paper';

type ProductDetailParams = {
  ProductDetail: {
    productId: string;
    title: string;
    price: number;
    image: string;
    description: string;
  };
};

type TabType = 'info' | 'recommend' | 'review' | 'qna';

const TAB_HEIGHT = 50;
const HEADER_HEIGHT = 56; // 기본 헤더 높이
const IMAGE_HEIGHT = 300;

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<ProductDetailParams, 'ProductDetail'>>();
  const navigation = useNavigation();
  const { title, price, image, description } = route.params;
  const screenHeight = Dimensions.get('window').height;

  const scrollViewRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [stickyHeaderIndex, setStickyHeaderIndex] = useState(2); // 탭 셀렉터의 인덱스

  // 각 섹션의 위치를 저장할 ref
  const sectionPositions = useRef<Record<TabType, number>>({
    info: 0,
    recommend: 0,
    review: 0,
    qna: 0,
  });

  // 스크롤 위치에 따라 활성 탭 변경
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      const headerOffset = HEADER_HEIGHT + TAB_HEIGHT;
      const scrollPosition = value + headerOffset;

      // 각 섹션의 위치를 확인하여 활성 탭 결정
      if (scrollPosition >= sectionPositions.current.qna) {
        setActiveTab('qna');
      } else if (scrollPosition >= sectionPositions.current.review) {
        setActiveTab('review');
      } else if (scrollPosition >= sectionPositions.current.recommend) {
        setActiveTab('recommend');
      } else {
        setActiveTab('info');
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);

  // 탭 선택 시 해당 섹션으로 스크롤
  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    const yOffset = sectionPositions.current[tab] - (HEADER_HEIGHT + TAB_HEIGHT);
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
  };

  // 섹션 위치 측정
  const onLayout = (tab: TabType) => (event: any) => {
    const { y } = event.nativeEvent.layout;
    sectionPositions.current[tab] = y;
  };

  // 탭 셀렉터 컴포넌트
  const TabSelector = ({ style }: { style?: any }) => (
    <View style={[styles.tabSelector, style]}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'info' && styles.activeTab]}
        onPress={() => handleTabPress('info')}
      >
        <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>정보</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'recommend' && styles.activeTab]}
        onPress={() => handleTabPress('recommend')}
      >
        <Text style={[styles.tabText, activeTab === 'recommend' && styles.activeTabText]}>추천</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'review' && styles.activeTab]}
        onPress={() => handleTabPress('review')}
      >
        <Text style={[styles.tabText, activeTab === 'review' && styles.activeTabText]}>후기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'qna' && styles.activeTab]}
        onPress={() => handleTabPress('qna')}
      >
        <Text style={[styles.tabText, activeTab === 'qna' && styles.activeTabText]}>문의</Text>
      </TouchableOpacity>
    </View>
  );

  // 스크롤 위치에 따른 탭 셀렉터 위치 계산
  const tabSelectorTranslateY = scrollY.interpolate({
    inputRange: [0, IMAGE_HEIGHT + 100], // 이미지 높이 + 제목/가격 영역
    outputRange: [0, IMAGE_HEIGHT + 100 - HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        stickyHeaderIndices={[2]}
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          scrollY.setValue(offsetY);
        }}
        scrollEventThrottle={16}
      >
        <Image
          // source={{ uri: image }}
          source={require('../../assets/images/nail1.png')}
          style={styles.image} />

        {/* 상품 기본 정보 영역 */}
        <View style={styles.basicInfoContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price.toLocaleString()}원</Text>
        </View>

        {/* 탭 셀렉터 */}
        <TabSelector />

        {/* 섹션 컨테이너 */}
        <View style={styles.sectionsContainer}>
          {/* 정보 섹션 */}
          <View onLayout={onLayout('info')} style={styles.section}>
            <Text style={styles.sectionTitle}>상품 정보</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {/* 추천 섹션 */}
          <View onLayout={onLayout('recommend')} style={styles.section}>
            <Text style={styles.sectionTitle}>추천 상품</Text>
            <View style={styles.recommendContainer}>
              {/* 추천 상품 목록 */}
              <Text style={styles.emptyText}>추천 상품이 없습니다.</Text>
            </View>
          </View>

          {/* 후기 섹션 */}
          <View onLayout={onLayout('review')} style={styles.section}>
            <Text style={styles.sectionTitle}>상품 후기</Text>
            <View style={styles.reviewContainer}>
              {/* 후기 목록 */}
              <Text style={styles.emptyText}>등록된 후기가 없습니다.</Text>
            </View>
          </View>

          {/* 문의 섹션 */}
          <View onLayout={onLayout('qna')} style={styles.section}>
            <Text style={styles.sectionTitle}>상품 문의</Text>
            <View style={styles.qnaContainer}>
              {/* 문의 목록 */}
              <Text style={styles.emptyText}>등록된 문의가 없습니다.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 구매하기 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => {
            // 구매하기 로직 구현
          }}
        >
          <Text style={styles.buyButtonText}>구매하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  basicInfoContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  sectionsContainer: {
    padding: 16,
    paddingBottom: 80, // 하단 바 높이만큼 여백 추가
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  tabSelector: {
    flexDirection: 'row',
    height: TAB_HEIGHT,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  recommendContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qnaContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buyButton: {
    backgroundColor: colors.primary,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
