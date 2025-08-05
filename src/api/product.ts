import axiosInstance from './axios';
import { Product, ProductSearchRequest, ProductSearchResponse } from '../types/product';

export const getProductDetail = async (productId: string): Promise<Product> => {
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

// 상품 목록 조회
export const getProductList = async (listNum: number, sort: 'CREATED_AT_DESC' | 'RECOMMEND'): Promise<ProductSearchResponse> => {
  try {
    const response = await axiosInstance.get('/products/list', {
      params: {
        listNum,
        sort
      }
    });
    return response.data;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw error;
  }
};
