import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, UserData } from '../api/user';

interface UserContextType {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => Promise<void>;
  logout: () => Promise<void>;
  handleTokenExpiration: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [userData, setUserDataState] = useState<UserData | null>(null);

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await AsyncStorage.setItem('token', newToken);
    } else {
      await AsyncStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  const setUserData = async (newUserData: UserData | null) => {
    if (newUserData) {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    } else {
      await AsyncStorage.removeItem('userData');
    }
    setUserDataState(newUserData);
  };

  const fetchUserData = async () => {
    if (!token) return;
    
    try {
      const userData = await getCurrentUser(token);
      await setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // 사용자 정보를 가져오는데 실패하면 로그아웃 처리
      await handleTokenExpiration();
    }
  };

  useEffect(() => {
    // 앱 시작 시 저장된 토큰과 사용자 데이터 로드
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedToken) {
          setTokenState(storedToken);
          if (storedUserData) {
            setUserDataState(JSON.parse(storedUserData));
          } else {
            // 토큰은 있지만 사용자 데이터가 없는 경우 사용자 정보를 가져옴
            await fetchUserData();
          }
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  // 토큰이 변경될 때마다 사용자 정보를 가져옴
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      setTokenState(null);
      setUserDataState(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const handleTokenExpiration = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      setTokenState(null);
      setUserDataState(null);
    } catch (error) {
      console.error('Token expiration error:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ token, setToken, userData, setUserData, logout, handleTokenExpiration }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 