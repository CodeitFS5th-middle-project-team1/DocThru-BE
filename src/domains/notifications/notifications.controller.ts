import { Request, Response } from 'express';
import prisma from '../../prismaClient';
/**
 * @swagger
 * tags:
 *   name: Notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: 알림 목록 조회
 *     tags: [Notifications]
 *     description: 현재 로그인한 사용자의 모든 알림을 최신순으로 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 알림 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 알림 ID
 *                   userId:
 *                     type: string
 *                     description: 알림 수신자 ID
 *                   category:
 *                     type: string
 *                     description: "알림 카테고리 (예: feedback, challenge)"
 *                   type:
 *                     type: string
 *                     description: "알림 타입 (예: created, updated)"
 *                   message:
 *                     type: string
 *                     description: 알림 메시지 내용
 *                   translationId:
 *                     type: string
 *                     description: 관련된 번역물 ID (해당하는 경우)
 *                     nullable: true
 *                   challengeId:
 *                     type: string
 *                     description: 관련된 챌린지 ID (해당하는 경우)
 *                     nullable: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: 알림 생성 시간
 *             example:
 *               - id: 1
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 category: "feedback"
 *                 type: "created"
 *                 message: "💬 'MODERN JS' 챌린지에 제출한 나의 번역물에 피드백이 추가되었어요."
 *                 read: false
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 challengeId: "b3c6e8d9-1234-5678-90ab-cdef01234567"
 *                 createdAt: "2025-04-05T08:30:25.305Z"
 *               - id: 2
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 category: "challenge"
 *                 type: "approved"
 *                 message: "🎉 'NEXT APP ROUTER 챌린지' 참여 신청이 승인되었어요!"
 *                 read: true
 *                 translationId: null
 *                 challengeId: "d4e5f6g7-8901-2345-67h8-i9jk01234567"
 *                 createdAt: "2025-04-04T10:15:30.123Z"
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 인증되지 않음
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 알림 조회 중 오류 발생
 */

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user?.id; //미들웨어에서 추출
  if (!userId) return res.status(401).json({ message: '인증되지 않음' });

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(notifications);
};

// export const markAsRead = async (req: Request, res: Response) => {
//   const notificationId = Number(req.params.id);
//   await prisma.notification.update({
//     where: { id: notificationId },
//     data: { isRead: true },
//   });
//   return res.status(204).end();
// };

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: 알림 삭제
 *     tags: [Notifications]
 *     description: 특정 ID의 알림을 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 삭제할 알림의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 알림이 성공적으로 삭제됨 (반환 데이터 없음)
 *       400:
 *         description: 유효하지 않은 알림 ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 유효하지 않은 알림 ID입니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 알림 삭제 중 오류 발생
 */
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
