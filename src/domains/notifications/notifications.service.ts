import prisma from '../../prismaClient';

interface CreateNotificationInput {
  userId: string;
  category: 'challenge' | 'translation' | 'feedback' | 'admin';
  type: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'closed';
  message: string;
  reason?: string;
  challengeId?: string;
  translationId?: string;
  feedbackId?: string;
}
//알림 생성
export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      ...input,
    },
  });
}
