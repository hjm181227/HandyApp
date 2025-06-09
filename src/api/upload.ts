import axiosInstance from "./axios";

export const getPresignedUrl = async (fileName: string): Promise<string> => {
  try {
    const response = await axiosInstance.post('/images/presigned-url', { fileName });
    return response.data.presignedUrl;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};
