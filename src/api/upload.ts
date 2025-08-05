import axiosInstance from "./axios";

export const getPresignedUrl = async (fileName: string): Promise<string> => {
  try {
    console.log('Presigned URL 요청 - fileName:', fileName);
    const response = await axiosInstance.post('/images/presigned-url', { fileName });
    console.log('Presigned URL 응답:', response.data);
    const presignedUrl = response.data.presignedUrl;
    console.log('추출된 presignedUrl:', presignedUrl);
    return presignedUrl;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};
