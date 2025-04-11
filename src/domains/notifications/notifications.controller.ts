import { Request, Response } from 'express';
import prisma from '../../prismaClient';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id; //미들웨어에서 추출
  if (!userId) return res.status(401).json({ message: '인증되지 않음' });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(notifications);
};

export const markAsRead = async (req: Request, res: Response) => {
  const notificationId = Number(req.params.id);
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  return res.status(204).end();
};
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = Number(req.params.id);
    if (isNaN(notificationId)) {
      return res.status(400).json({ message: '유효하지 않은 알림 ID입니다.' });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return res.status(204).end(); // No Content
  } catch (err) {
    console.error('알림 삭제 오류:', err);
    return res.status(500).json({ message: '알림 삭제 중 오류 발생' });
  }
};
