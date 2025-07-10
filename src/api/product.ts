import axiosInstance from './axios';
import { ProductSearchRequest, ProductSearchResponse } from '../types/product';

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  // 필요한 다른 상품 상세 정보들도 여기에 추가
}

export const getProductDetail = async (productId: string): Promise<ProductDetail> => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('상품 상세 정보 조회 실패:', error);
    throw error;
  }
};

// 상품 검색
export const searchProducts = async (searchRequest: ProductSearchRequest): Promise<ProductSearchResponse> => {
  try {
    const response = await axiosInstance.post('/products/search', searchRequest);
    return response.data;
  } catch (error) {
    console.error('상품 검색 실패:', error);
    throw error;
  }
};
