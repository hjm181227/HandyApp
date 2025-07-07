export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
  };
}

export const extractData = <T>(response: { data: ApiResponse<T> }): T => {
  return response.data.data;
};

export const extractDataAndPagination = <T>(response: { data: ApiResponse<T> }) => {
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}; 