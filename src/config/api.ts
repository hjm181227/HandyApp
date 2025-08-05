import { Platform } from 'react-native';

// API 기본 URL 설정
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';  // 안드로이드 에뮬레이터
    }
    return 'http://localhost:8080/api';    // iOS 시뮬레이터
  }
  return 'https://15.165.22.118/api';   // 프로덕션 환경
};

export const API_URL = getBaseUrl();

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',

  // 상품 관련
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  UPLOAD: '/upload',

  // 사용자 관련
  USER_ME: '/users/me',
  USER_PROFILE: '/users/profile',
  USER_PRODUCTS: '/users/products',
};

// API 요청 타임아웃 설정 (밀리초)
export const API_TIMEOUT = 10000;

// API 요청 헤더
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
