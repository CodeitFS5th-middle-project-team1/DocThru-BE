import { createNotification } from './notifications.service';

export async function notifyUser({
  userId,
  category,
  type,
  message,
  challengeId,
  translationId,
  feedbackId,
  reason,
}: {
  userId: string;
  category: 'challenge' | 'translation' | 'feedback' | 'admin';
  type: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'closed';
  message: string;
  challengeId?: string;
  translationId?: string;
  feedbackId?: string;
  reason?: string;
}) {
  return await createNotification({
    userId,
    category,
    type,
    message,
    challengeId,
    translationId,
    feedbackId,
    reason,
  });
}
