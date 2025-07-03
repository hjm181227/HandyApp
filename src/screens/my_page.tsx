import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, InteractionManager } from 'react-native';
import { Text, List, IconButton, Avatar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../navigation/myPageStack';
import HandyColors from "../../colors";
import { useUser } from '../context/UserContext';

type MyPageScreenNavigationProp = StackNavigationProp<MyPageStackParamList, 'MyPageMain'>;

const MyPageScreen = () => {
  const navigation = useNavigation<MyPageScreenNavigationProp>();
  const { userData, logout } = useUser();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  console.log('userData:', userData);
  console.log('profileImageUrl:', userData?.profileImageUrl);

  useEffect(() => {
    setImageError(false);
  }, [userData?.profileImageUrl]);

  // AVIF 형식인지 확인하는 함수
  const isAVIFImage = (url: string) => {
    return url.includes('avif') || url.includes('image/avif');
  };

  // 이미지 URL이 유효하고 AVIF가 아닌지 확인
  const isValidImageUrl = (url: string) => {
    return url && !isAVIFImage(url);
  };

  const handleLogout = () => {
    InteractionManager.runAfterInteractions(() => {
      Alert.alert(
        '로그아웃',
        '정말 로그아웃 하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그아웃',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
              } catch (error) {
                console.error('Logout failed:', error);
                InteractionManager.runAfterInteractions(() => {
                  Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
                });
              }
            },
          },
        ],
      );
    });
  };

  const menuItems = [
    { title: '주문내역', description: '', icon: 'receipt', onPress: () => {} },
    { title: '판매자 센터', description: '상품 관리, 주문 관리, 대시보드', icon: 'account-cash', onPress: () => navigation.navigate('ModalStack', {
      screen: 'SellerPage'
    }) },
    // { title: '최근 본 상품', icon: 'history', onPress: () => {} },
    { title: '나의 맞춤 정보', description: '손톱 사이즈 측정하고 맞춤 주문 하기', icon: 'account-heart', onPress: () => navigation.navigate('NailMeasurement') },
    { title: '고객센터', icon: 'headphones', onPress: () => navigation.navigate('Inquiry') },
    { title: '1:1 문의 내역', icon: 'message-text', onPress: () => navigation.navigate('MyInquiry') },
    // { title: '상품 문의 내역', icon: 'comment-question', onPress: () => {} },
    { title: '공지사항', icon: 'bell', onPress: () => {} },
    { title: '로그아웃', icon: 'logout', onPress: handleLogout, titleStyle: { color: HandyColors.primary90 } }
  ];

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.headerIcons}>
        {/*<IconButton*/}
        {/*  icon="bell"*/}
        {/*  size={24}*/}
        {/*  onPress={() => {}}*/}
        {/*/>*/}
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('ModalStack', {
            screen: 'Setting'
          })}
        />
        <IconButton
          icon="shopping-outline"
          size={24}
          onPress={() => navigation.navigate('ModalStack', {
            screen: 'Cart'
          })}
        />
      </View>

      {/* User Info Section */}
      <View style={styles.userInfoSection}>
        {userData?.profileImageUrl && isValidImageUrl(userData.profileImageUrl) && !imageError ? (
          <View style={{ position: 'relative' }}>
            <Avatar.Image
              source={{ uri: userData.profileImageUrl }}
              size={100}
              style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.2)', backgroundColor: '#e0e0e0' }}
              onError={(error) => {
                console.error('Image loading error:', error.nativeEvent);
                console.log('Failed URL:', userData.profileImageUrl);
                setImageError(true);
              }}
              onLoadStart={() => {
                console.log('Image loading started:', userData.profileImageUrl);
                setImageLoading(true);
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', userData.profileImageUrl);
                setImageLoading(false);
              }}
              onLoadEnd={() => {
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color={HandyColors.primary90} />
              </View>
            )}
          </View>
        ) : (
          <Avatar.Icon
            size={100}
            icon="account"
            style={{ backgroundColor: '#e0e0e0' }}
          />
        )}
        <Text style={styles.userName}>{userData?.name}</Text>
      </View>

      {/* Menu List */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <List.Item
            key={index}
            title={item.title}
            description={item.description}
            descriptionStyle={{ fontSize: 12, color: HandyColors.grayLight }}
            left={props => <List.Icon {...props} icon={item.icon} color={item.titleStyle?.color} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={item.onPress}
            titleStyle={item.titleStyle}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
  },
  userInfoSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  menuList: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyPageScreen;
