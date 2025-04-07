import prisma from '../../prismaClient';
import { Request, Response } from 'express';
// 알림 조회
export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      challenge: true,
      translation: true,
      feedback: true,
    },
  });

  return res.json(notifications);
};

// 알림 읽음 처리
export const markAsRead = async (req: Request, res: Response) => {
  const notificationId = Number(req.params.id);

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return res.status(204).end();
};
