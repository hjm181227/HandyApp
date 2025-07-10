import React, { useState } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import ImageUploader from './ImageUploader';
import { deleteProfileImage } from '../api/user';

interface ProfileImageUploaderProps {
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: Error) => void;
  onImageChanged?: (imageUrl: string) => void;
  onImageRemoved?: () => void;
  onPickImage?: () => void;
  size?: number;
  initialValue?: string;
  showPickButton?: boolean;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  onImageChanged,
  onImageRemoved,
  onPickImage,
  size = 100,
  initialValue,
  showPickButton = false,
}) => {
  const [triggerPick, setTriggerPick] = useState(false);

  const handleImageRemove = async () => {
    Alert.alert(
      '프로필 이미지 제거',
      '프로필 이미지를 제거하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '제거',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfileImage();
              onImageRemoved?.();
              onUploadSuccess?.('');
              onImageChanged?.('');
            } catch (error) {
              console.error('Error removing profile image:', error);
              Alert.alert('오류', '프로필 이미지 제거 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handlePickImage = () => {
    setTriggerPick(true);
    onPickImage?.();
  };

  const handlePickTriggered = () => {
    setTriggerPick(false);
  };

  return (
    <View style={styles.wrapper}>
      <ImageUploader
        width={size}
        height={size}
        initialValue={initialValue}
        onUploadSuccess={onUploadSuccess}
        onUploadError={onUploadError}
        onImageChanged={onImageChanged}
        onImageRemove={handleImageRemove}
        triggerPick={triggerPick}
        onPickTriggered={handlePickTriggered}
        containerStyle={styles.container}
        imageStyle={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        iconComponent={<Avatar.Icon size={size * 0.6} icon="account" style={styles.defaultIcon} />}
        label="프로필 이미지 변경"
      />
      
      {showPickButton && (
        <Button
          mode="outlined"
          onPress={handlePickImage}
          style={styles.pickButton}
          icon="image"
        >
          이미지 선택
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    marginVertical: 8,
    borderRadius: 50,
  },
  image: {
    borderRadius: 50,
  },
  defaultIcon: {
    backgroundColor: '#e0e0e0',
  },
  pickButton: {
    marginTop: 10,
  },
});

export default ProfileImageUploader;
 