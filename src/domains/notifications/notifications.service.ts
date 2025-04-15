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

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: 알림 생성
 *     tags: [Notifications]
 *     description: 새로운 알림을 생성합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - category
 *               - type
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *                 description: "알림을 받을 사용자 ID"
 *               category:
 *                 type: string
 *                 description: "알림 카테고리"
 *                 enum: [challenge, translation, feedback, admin]
 *               type:
 *                 type: string
 *                 description: "알림 유형"
 *                 enum: [created, updated, deleted, approved, rejected, closed]
 *               message:
 *                 type: string
 *                 description: "알림 메시지"
 *               reason:
 *                 type: string
 *                 description: "추가 설명(선택사항)"
 *               challengeId:
 *                 type: string
 *                 description: "관련된 챌린지 ID(선택사항)"
 *               translationId:
 *                 type: string
 *                 description: "관련된 번역 ID(선택사항)"
 *               feedbackId:
 *                 type: string
 *                 description: "관련된 피드백 ID(선택사항)"
 *           examples:
 *             challenge_notification:
 *               value:
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 category: "challenge"
 *                 type: "approved"
 *                 message: "🎉 'MODERN JS' 챌린지 참여 신청이 승인되었어요!"
 *                 challengeId: "b3c6e8d9-1234-5678-90ab-cdef01234567"
 *             feedback_notification:
 *               value:
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 category: "feedback"
 *                 type: "created"
 *                 message: "💬 번역물에 새 피드백이 추가되었어요."
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *     responses:
 *       201:
 *         description: 알림이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 생성된 알림 ID
 *                 userId:
 *                   type: string
 *                   description: 알림 수신자 ID
 *                 category:
 *                   type: string
 *                   description: "알림 카테고리"
 *                 type:
 *                   type: string
 *                   description: "알림 유형"
 *                 message:
 *                   type: string
 *                   description: "알림 메시지"
 *                 read:
 *                   type: boolean
 *                   description: "읽음 여부(기본값: false)"
 *                 reason:
 *                   type: string
 *                   description: "추가 설명"
 *                   nullable: true
 *                 challengeId:
 *                   type: string
 *                   description: "관련 챌린지 ID"
 *                   nullable: true
 *                 translationId:
 *                   type: string
 *                   description: "관련 번역 ID"
 *                   nullable: true
 *                 feedbackId:
 *                   type: string
 *                   description: "관련 피드백 ID"
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: "생성 시간"
 *             example:
 *               id: 123
 *               userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *               category: "challenge"
 *               type: "approved"
 *               message: "🎉 'MODERN JS' 챌린지 참여 신청이 승인되었어요!"
 *               read: false
 *               reason: null
 *               challengeId: "b3c6e8d9-1234-5678-90ab-cdef01234567"
 *               translationId: null
 *               feedbackId: null
 *               createdAt: "2025-04-05T08:30:25.305Z"
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필수 필드가 누락되었습니다"
 *       401:
 *         description: 인증되지 않은 사용자
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증되지 않음"
 *       403:
 *         description: 알림 생성 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "알림 생성 권한이 없습니다"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "알림 생성 중 오류가 발생했습니다"
 */

export async function createNotification(input: CreateNotificationInput) {
  return await prisma.notification.create({
    data: input,
  });
}
