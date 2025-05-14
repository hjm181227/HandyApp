import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: number;
  email: string;
  name: string;
}

interface UserContextType {
  userData: UserData | null;
  token: string | null;
  setUserData: (data: UserData | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 앱 시작 시 저장된 유저 정보 로드
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedToken, storedUserData] = await Promise.all([
        AsyncStorage.getItem('userToken'),
        AsyncStorage.getItem('userData'),
      ]);

      if (storedToken && storedUserData) {
        setToken(storedToken);
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('userToken'),
        AsyncStorage.removeItem('userData'),
      ]);
      setToken(null);
      setUserData(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        token,
        setUserData,
        setToken,
        logout,
      }}
    >
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