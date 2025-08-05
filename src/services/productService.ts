import { Platform } from 'react-native';
import axios from 'axios';
import { API_URL, API_ENDPOINTS, getDefaultHeaders } from '../config/api';
import { Product, ProductImage, Shape, ProductSize } from '../types/product';
import { useUser } from "../context/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TPO = 'daily' | 'party' | 'wedding' | 'performance';

export interface ProductUploadData {
  name: string;
  description: string;
  shape: Shape;
  shapeChangeable: boolean;
  size: ProductSize;
  sizeChangeable: boolean;
  price: number;
  productionDays: number;
  categoryIds: number[];
  mainImageUrl: string;
  detailImages: ProductImage[];
  customAvailable: boolean;
}

export interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 상품 등록 함수
export const uploadProduct = async (data: ProductUploadData, token: string): Promise<Product> => {
  console.log('uploadProduct 호출 - 원본 데이터:', data);
  console.log('uploadProduct 호출 - mainImageUrl:', data.mainImageUrl);
  console.log('uploadProduct 호출 - categoryIds:', data.categoryIds);
  console.log('uploadProduct 호출 - JSON 직렬화:', JSON.stringify(data));
  
  // 데이터 검증 - 서버 필드명에 맞춰 조정
  const requestData = {
    name: data.name,
    description: data.description,
    shape: data.shape,
    shapeChangeable: data.shapeChangeable,
    size: data.size,
    sizeChangeable: data.sizeChangeable,
    price: data.price,
    productionDays: data.productionDays,
    categoryIds: data.categoryIds,
    mainImageUrl: data.mainImageUrl,  // 서버에서 이 필드명을 인식하는지 확인 필요
    // mainImage: data.mainImageUrl,  // 또는 이 필드명일 수도 있음
    detailImages: data.detailImages,
    customAvailable: data.customAvailable,
  };
  
  console.log('uploadProduct 호출 - 검증된 데이터:', requestData);
  console.log('uploadProduct 호출 - 검증된 JSON:', JSON.stringify(requestData));
  
  try {
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.PRODUCTS}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading product:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error data:', error.response?.data);
      console.error('Axios error message:', error.response?.data?.message);
      console.error('Axios error details:', JSON.stringify(error.response?.data));
      throw new Error(error.response?.data?.message || '상품 등록에 실패했습니다.');
    }
    throw error;
  }
};

// 상품 목록 조회 함수
export const getProducts = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}${API_ENDPOINTS.PRODUCTS}`, {
      headers: getDefaultHeaders(),
    });
    return response.data.products;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록을 불러오는데 실패했습니다.');
  }
};

// 상품 상세 조회 함수
export const getProductById = async (productId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}${API_ENDPOINTS.PRODUCT_DETAIL(productId)}`, {
      headers: getDefaultHeaders(),
    });
    return response.data.product;
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    throw new Error('상품 정보를 불러오는데 실패했습니다.');
  }
};

export const getSellerProducts = async (sellerId: number): Promise<ProductResponse> => {
  const response = await axios.get(`${API_URL}/products/seller/${sellerId}`);
  return response.data;
};
