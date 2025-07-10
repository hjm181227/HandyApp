export interface Product {
  id: number;
  name: string;
  mainImageUrl: string;
  price: number;
  productionDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  detailImages: string[];
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