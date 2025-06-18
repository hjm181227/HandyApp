import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, List, Avatar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../navigation/myPageStack';

type SettingScreenNavigationProp = StackNavigationProp<MyPageStackParamList, 'Setting'>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();

  const menuItems = [
    { title: '회원정보 변경', icon: 'account-edit', onPress: () => {} },
    { title: '비밀번호 변경', icon: 'lock', onPress: () => {} },
    // { title: '나의 맞춤 정보', icon: 'account-heart', onPress: () => navigation.navigate('NailMeasurement') },
    // { title: '배송지 관리', icon: 'map-marker', onPress: () => {} },
    // { title: '환불 계좌 관리', icon: 'bank', onPress: () => {} },
    // { title: '알림 설정', icon: 'bell', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Image
          size={100}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
        <Text style={styles.userName}>홍길동</Text>
        <Text style={styles.userId}>@user123</Text>
        <View style={styles.profileButtons}>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.profileButton}
          >
            프로필 이미지 변경
          </Button>
          <Button
            mode="outlined"
            onPress={() => {}}
            style={styles.profileButton}
          >
            닉네임 변경
          </Button>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <List.Item
            key={index}
            title={item.title}
            left={props => <List.Icon {...props} icon={item.icon} />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={item.onPress}
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  userId: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  profileButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  profileButton: {
    marginHorizontal: 5,
  },
  menuList: {
    flex: 1,
  },
});

export default SettingScreen;
