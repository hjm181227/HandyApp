import axiosInstance from './axios';
import { Notice, NoticeListResponse, NoticeDetailResponse } from '../types/notice';

// 공지사항 목록 조회
export const getNoticeList = async (page: number = 1, size: number = 20): Promise<NoticeListResponse> => {
  try {
    const response = await axiosInstance.get(`/notices?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 목록 조회 실패:', error);
    throw error;
  }
};

// 공지사항 상세 조회
export const getNoticeDetail = async (noticeId: number): Promise<NoticeDetailResponse> => {
  try {
    const response = await axiosInstance.get(`/notices/${noticeId}`);
    return response.data;
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error);
    throw error;
  }
};
