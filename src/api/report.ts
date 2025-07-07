import axiosInstance from './axios';

export type ReportReason =
  | 'SPAM'
  | 'INAPPROPRIATE'
  | 'HARASSMENT'
  | 'VIOLENCE'
  | 'COPYRIGHT'
  | 'PRIVACY'
  | 'FRAUD'
  | 'OTHER';

export const reportSnap = async (
  snapId: number,
  reason: ReportReason,
  content?: string
) => {
  await axiosInstance.post('/reports', {
    targetId: snapId,
    targetType: 'SNAP',
    reason,
    content,
  });
}; 