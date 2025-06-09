import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_URL, API_TIMEOUT, getDefaultHeaders } from '../config/api';

// 간단한 이벤트 시스템 구현
type EventCallback = () => void;
const eventListeners: { [key: string]: EventCallback[] } = {};

export const authEventEmitter = {
  on: (event: string, callback: EventCallback) => {
    if (!eventListeners[event]) {
      eventListeners[event] = [];
    }
    eventListeners[event].push(callback);
  },
  off: (event: string, callback: EventCallback) => {
    if (eventListeners[event]) {
      eventListeners[event] = eventListeners[event].filter(cb => cb !== callback);
    }
  },
  emit: (event: string) => {
    if (eventListeners[event]) {
      eventListeners[event].forEach(callback => callback());
    }
  }
};

// 개발 환경에 따른 baseURL 설정
const baseURL = Platform.select({
  ios: 'http://localhost:8080/api',
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

const axiosInstance = axios.create({
  baseURL,
  timeout: API_TIMEOUT,
  headers: getDefaultHeaders(),
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = ''; // 토큰이 없을 경우 Authorization 헤더를 비웁니다.
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      // AsyncStorage에서 토큰과 사용자 데이터를 삭제
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');

      // 토큰 만료 이벤트 발생
      authEventEmitter.emit('tokenExpired');
    }
    if (error.response) {
      // 서버가 응답을 반환한 경우
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return Promise.reject({
        message: '서버와의 통신에 실패했습니다.',
      });
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      return Promise.reject({
        message: '요청을 처리하는 중 오류가 발생했습니다.',
      });
    }
  }
);

export default axiosInstance;
