import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (): Promise<void> => {
  try {
    // 저장된 토큰과 사용자 정보 삭제
    await AsyncStorage.multiRemove(['token', 'userData']);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('로그아웃 중 오류가 발생했습니다.');
  }
}; 