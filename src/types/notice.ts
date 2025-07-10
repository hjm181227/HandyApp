export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NoticeListResponse {
  data: Notice[];
  total: number;
  page: number;
  size: number;
}

export interface NoticeDetailResponse {
  data: Notice;
}
