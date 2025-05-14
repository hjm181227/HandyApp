import axios from 'axios';
import { Platform } from 'react-native';

// API 기본 URL 설정
const BASE_URL = Platform.select({
  ios: 'http://localhost:8080/api',
  android: 'http://172.30.1.84:8080/api', // Android 에뮬레이터용
  default: 'http://172.30.1.84:8080/api',
});

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.log('Error Response:', error.response.data);
    } else if (error.request) {
      // 요청이 전송되었으나 응답을 받지 못한 경우
      console.log('Error Request:', error.request);
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.log('Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
