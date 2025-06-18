import axiosInstance from "./axios";
import { AxiosError } from 'axios';

export interface UserData {
  id: number;
  name: string;
  email: string;
  profileImageUrl?: string;
}

export const getCurrentUser = async (token: string): Promise<UserData> => {
  const response = await axiosInstance.get('/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  return response.data;
};

export const login = async (email: string, password: string): Promise<{ token: string; id: number; email: string; name: string }> => {
  try {
    console.log('Login request:', { email, password });
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Login error details:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw error;
  }
};
