import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { Text, List, Avatar, Button, Portal, Dialog } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MyPageStackParamList } from '../navigation/myPageStack';
import ProfileImageUploader from '../components/ProfileImageUploader';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { getCurrentUser, updateProfileImage, changePassword } from '../api/user';
import { useUser } from '../context/UserContext';

type SettingScreenNavigationProp = StackNavigationProp<MyPageStackParamList, 'Setting'>;

const SettingScreen = () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const { userData, setUserData, logout, token } = useUser();
  const [profileImageModalVisible, setProfileImageModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | undefined>(userData?.profileImageUrl);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const menuItems = [
    { title: '회원정보 변경', icon: 'account-edit', onPress: () => {} },
    { title: '비밀번호 변경', icon: 'lock', onPress: () => setChangePasswordModalVisible(true) },
    // { title: '나의 맞춤 정보', icon: 'account-heart', onPress: () => navigation.navigate('NailMeasurement') },
    // { title: '배송지 관리', icon: 'map-marker', onPress: () => {} },
    // { title: '환불 계좌 관리', icon: 'bank', onPress: () => {} },
    // { title: '알림 설정', icon: 'bell', onPress: () => {} },
  ];

  const handleProfileImageChange = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleSaveProfileImage = async () => {
    if (!selectedImageUrl) {
      Alert.alert('알림', '선택된 이미지가 없습니다.');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfileImage(selectedImageUrl);
      setCurrentProfileImage(selectedImageUrl);

      // UserContext의 userData도 업데이트
      if (userData) {
        await setUserData({
          ...userData,
          profileImageUrl: selectedImageUrl,
        });
      }

      setProfileImageModalVisible(false);
      Alert.alert('성공', '프로필 이미지가 변경되었습니다.');
    } catch (error) {
      console.error('Profile image update error:', error);
      Alert.alert('오류', '프로필 이미지 변경 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageRemoved = async () => {
    try {
      if (!token) {
        Alert.alert('오류', '사용자 인증 정보가 없습니다.');
        return;
      }
      const updatedUserData = await getCurrentUser(token);
      setCurrentProfileImage(updatedUserData.profileImageUrl);

      // UserContext의 userData도 업데이트
      if (updatedUserData) {
        await setUserData({
          ...updatedUserData
        });
      }

      setProfileImageModalVisible(false);
      Alert.alert('성공', '프로필 이미지가 제거되었습니다.');
    } catch (error) {
      console.error('Profile image removal error:', error);
      Alert.alert('오류', '프로필 이미지 제거 중 오류가 발생했습니다.');
    }
  };

  const handleCancelProfileImage = () => {
    setSelectedImageUrl('');
    setProfileImageModalVisible(false);
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setPasswordError(null);
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword, token!);
      setChangePasswordModalVisible(false);
      Alert.alert('비밀번호가 변경되었습니다.', '다시 로그인 해주세요.', [
        {
          text: '확인',
          onPress: async () => {
            await logout();
          },
        },
      ]);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setPasswordError(error.response.data?.message || '비밀번호 변경에 실패했습니다.');
      } else {
        setPasswordError('비밀번호 변경에 실패했습니다.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Image
          size={100}
          source={{ uri: currentProfileImage }}
          style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.2)', backgroundColor: '#e0e0e0' }}
        />
        <Text style={styles.userName}>{userData?.name || '홍길동'}</Text>
        <Text style={styles.userId}>@{userData?.email?.split('@')[0] || 'user123'}</Text>
        <View style={styles.profileButtons}>
          <Button
            mode="outlined"
            onPress={() => setProfileImageModalVisible(true)}
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

      {/* Profile Image Change Modal */}
      <Portal>
        <Modal
          visible={profileImageModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>프로필 이미지 변경</Text>
              <Button onPress={handleCancelProfileImage}>취소</Button>
            </View>

            <View style={styles.modalContent}>
              <ProfileImageUploader
                size={150}
                initialValue={currentProfileImage}
                onImageChanged={handleProfileImageChange}
                onUploadSuccess={(imageUrl) => {
                  setSelectedImageUrl(imageUrl);
                }}
                onUploadError={(error) => {
                  Alert.alert('오류', error.message);
                }}
                onImageRemoved={handleProfileImageRemoved}
                showPickButton={true}
              />

              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  onPress={handleSaveProfileImage}
                  loading={isSaving}
                  disabled={!selectedImageUrl || isSaving}
                  style={styles.saveButton}
                >
                  저장
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
        onSubmit={handleChangePassword}
        loading={passwordLoading}
        error={passwordError}
      />
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalButtons: {
    marginTop: 30,
    width: '100%',
  },
  saveButton: {
    marginTop: 10,
  },
});

export default SettingScreen;
