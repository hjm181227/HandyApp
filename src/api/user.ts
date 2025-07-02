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

export const updateProfileImage = async (imageUrl: string): Promise<{ success: boolean }> => {
  console.log(imageUrl);
  try {
    const response = await axiosInstance.post('/users/profile-image', {
      imageUrl,
    });
    return { success: true };
  } catch (error) {
    console.error('Profile image update error:', error);
    throw error;
  }
};

export const deleteProfileImage = async (): Promise<{ success: boolean }> => {
  try {
    const response = await axiosInstance.delete('/users/profile-image');
    return { success: true };
  } catch (error) {
    console.error('Profile image delete error:', error);
    throw error;
  }
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
    console.log(error);
    const axiosError = error as AxiosError;
    console.error('Login error details:', {
      message: axiosError.message,
      response: axiosError.response?.data,
      status: axiosError.response?.status,
    });
    throw error;
  }
};
