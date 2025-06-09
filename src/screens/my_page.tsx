import React from 'react';
import { View, StyleSheet, Image, Alert, InteractionManager } from 'react-native';
import { Text, List, IconButton, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/stack';
import HandyColors from "../../colors";
import { useUser } from '../context/UserContext';

type MyPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyPage'>;

const MyPageScreen = () => {
  const navigation = useNavigation<MyPageScreenNavigationProp>();
  const { userData, logout } = useUser();

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
    { title: '판매자 센터', description: '상품 관리, 주문 관리, 대시보드', icon: 'account-cash', onPress: () => navigation.navigate('SellerPage') },
    { title: '최근 본 상품', icon: 'history', onPress: () => {} },
    { title: '나의 맞춤 정보', description: '손톱 사이즈 측정하고 맞춤 주문 하기', icon: 'account-heart', onPress: () => {} },
    { title: '고객센터', icon: 'headphones', onPress: () => {} },
    { title: '1:1 문의 내역', icon: 'message-text', onPress: () => {} },
    { title: '상품 문의 내역', icon: 'comment-question', onPress: () => {} },
    { title: '공지사항', icon: 'bell', onPress: () => {} },
    { title: '로그아웃', icon: 'logout', onPress: handleLogout, titleStyle: { color: HandyColors.primary90 } }
  ];

  return (
    <View style={styles.container}>
      {/* Header Icons */}
      <View style={styles.headerIcons}>
        <IconButton
          icon="bell"
          size={24}
          onPress={() => {}}
        />
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('Setting')}
        />
        <IconButton
          icon="shopping-outline"
          size={24}
          onPress={() => navigation.navigate('Cart')}
        />
      </View>

      {/* User Info Section */}
      <View style={styles.userInfoSection}>
        <Avatar.Icon
          size={80}
          icon={"account"}
        />
        <Text style={styles.userName}>{userData?.name || '사용자'}</Text>
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
});

export default MyPageScreen;
