import { Platform } from 'react-native';
import axios from 'axios';
import { API_URL, API_ENDPOINTS, getDefaultHeaders } from '../config/api';

export type Shape = 'round' | 'almond' | 'oval' | 'stiletto' | 'square' | 'coffin';
export type TPO = 'daily' | 'party' | 'wedding' | 'performance';
export type ProductSize = 'SHORT' | 'MEDIUM' | 'LONG';

export interface ProductImage {
  imageUrl: string;
  description?: string;
}

export interface ProductUploadData {
  mainImage: ProductImage;
  name: string;
  description: string;
  shape: Shape;
  shapeChangable: boolean;
  length: ProductSize;
  lengthChangable: boolean;
  isCustomizable: boolean;
  detailImages: ProductImage[];
  price: number;
  productionTime: number;
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

export interface DetailImage {
  id: number;
  imageUrl: string;
  order: number;
  description: string;
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

// 이미지 업로드 함수
export const uploadImage = async (imageUri: string): Promise<string> => {
  try {
    // 이미지 파일 생성
    const formData = new FormData();

    // 파일 이름 추출
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    // 파일 이름 생성
    const fileName = `product_${Date.now()}.${fileType}`;

    // FormData에 파일 추가
    formData.append('file', {
      uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
      type: `image/${fileType}`,
      name: fileName,
    } as any);

    // API 호출
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.UPLOAD}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};

// 상품 등록 함수
export const uploadProduct = async (productData: ProductUploadData): Promise<{ success: boolean; productId?: string }> => {
  try {
    // 대표 이미지 업로드
    const mainImageUrl = await uploadImage(productData.mainImage.imageUrl);

    // 상세 이미지 업로드
    const productImagesWithUrls = await Promise.all(
      productData.detailImages.map(({ imageUrl, description }) => {
        return {
          url: imageUrl,
          description: description || '',
        };
      })
    );

    // 상품 데이터 준비
    const productPayload = {
      name: productData.name,
      description: productData.description,
      shape: productData.shape,
      shapeChangable: productData.shapeChangable,
      length: productData.length,
      lengthChangable: productData.lengthChangable,
      mainImage: mainImageUrl,
      images: productImagesWithUrls,
      price: productData.price,
      productionTime: productData.productionTime,
      isCustomizable: productData.isCustomizable,
    };

    // API 호출
    const response = await axios.post(`${API_URL}${API_ENDPOINTS.PRODUCTS}`, productPayload, {
      headers: getDefaultHeaders(),
    });

    return {
      success: true,
      productId: response.data.productId,
    };
  } catch (error) {
    console.error('상품 등록 실패:', error);
    throw new Error('상품 등록에 실패했습니다.');
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
