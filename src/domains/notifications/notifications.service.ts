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

export async function createNotification(input: CreateNotificationInput) {
  return await prisma.notification.create({
    data: input,
  });
}
