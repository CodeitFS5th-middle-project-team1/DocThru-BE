import prisma from '../../prismaClient';
import { Request, Response } from 'express';
import { createNotification } from './notifications.service';
// 알림 조회
export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(notifications);
};

//알림 생성
export const createNotificationHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const notification = await createNotification(req.body);
    return res.status(201).json(notification);
  } catch (error) {
    console.error('알림 생성 실패:', error);
    return res
      .status(500)
      .json({ message: '알림 생성 중 오류가 발생했습니다.' });
  }
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
