import { Platform } from 'react-native';
import axios from 'axios';
import { API_URL, API_ENDPOINTS, getDefaultHeaders } from '../config/api';
import { useUser } from "../context/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Shape = 'ROUND' | 'ALMOND' | 'OVAL' | 'STILETTO' | 'SQUARE' | 'COFFIN';
export type TPO = 'daily' | 'party' | 'wedding' | 'performance';
export type ProductSize = 'SHORT' | 'MEDIUM' | 'LONG';

export interface ProductImage {
  imageUrl: string;
  description?: string;
}

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

export interface ProductData {
  mainImage: ProductImage;
  name: string;
  description: string;
  shape: Shape;
  shapeChangable: boolean;
  length: ProductSize;
  lengthChangable: boolean;
  detailImages: ProductImage[];
  price: number;
  productionTime: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mainImageUrl: string;
  shapeChangable: boolean;
  lengthChangable: boolean;
  isCustomizable: boolean;
  productionTime: number;
  createdAt: string;
  updatedAt: string;
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
  try {
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.PRODUCTS}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading product:', error);
    if (axios.isAxiosError(error)) {
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
