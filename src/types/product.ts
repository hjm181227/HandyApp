// 공통 타입들
export type Shape = 'ROUND' | 'ALMOND' | 'OVAL' | 'STILETTO' | 'SQUARE' | 'COFFIN';
export type ProductSize = 'SHORT' | 'MEDIUM' | 'LONG';

export interface ProductImage {
  imageUrl: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  mainImageUrl: string;
  price: number;
  productionDays: number;
  shape: Shape;
  shapeChangeable: boolean;
  size: ProductSize;
  sizeChangeable: boolean;
  customAvailable: boolean;
  isActive: boolean;
  categoryIds: number[];
  detailImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSearchRequest {
  keyword: string;
  page: number;
  size: number;
  sort: 'CREATED_AT_DESC' | 'CREATED_AT_ASC' | 'PRICE_DESC' | 'PRICE_ASC' | 'NAME_ASC' | 'NAME_DESC';
}

export interface ProductSearchResponse {
  data: Product[];
  total: number;
  page: number;
  size: number;
} 