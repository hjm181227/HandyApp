export interface Snap {
  id: number;
  title: string;
  content: string;
  userId: number;
  userName: string;
  userProfileImage: string | null;
  images: string[];
  createdAt: string;
  updatedAt: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface SnapListResponse {
  data: Snap[];
  pagination: Pagination;
}
 