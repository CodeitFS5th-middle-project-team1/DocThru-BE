import { GetController } from '../../types/express';
import { GetFeedBackListParams } from './feedbacks.validation';
import FeedbackService from './feedbacks.service';
import { GetFeedbackListResponse } from './feedbacks.type';

/**
 * @swagger
 * /api/translations/{translationId}/feedbacks:
 *   get:
 *     tags:
 *       - Feedbacks
 *     summary: 번역에 대한 피드백 목록 조회
 *     description: 특정 번역에 대한 피드백 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 조회할 번역의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공적으로 피드백 목록을 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 피드백 ID
 *                       idx:
 *                         type: integer
 *                         description: 피드백 인덱스
 *                       translationId:
 *                         type: string
 *                         description: 피드백이 달린 번역 ID
 *                       userId:
 *                         type: string
 *                         description: 피드백을 작성한 사용자 ID
 *                       userNickname:
 *                         type: string
 *                         description: 피드백을 작성한 사용자 닉네임
 *                       userProfileImg:
 *                         type: string
 *                         nullable: true
 *                         description: 피드백을 작성한 사용자 프로필 이미지
 *                       content:
 *                         type: string
 *                         description: 피드백 내용
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 피드백 작성 시간
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 피드백 수정 시간
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: 피드백 삭제 시간
 *             example:
 *               feedbacks: [
 *                 {
 *                   "id": "74f4e104-d49e-4cbb-93c0-8b67b7333975",
 *                   "idx": 70,
 *                   "translationId": "02f43933-41fb-4dd5-8426-700f17beb6fa",
 *                   "userId": "user-1",
 *                   "userNickname": "총명한판다",
 *                   "userProfileImg": null,
 *                   "content": "다음에도 이런 번역 기대할게요 👍",
 *                   "createdAt": "2025-04-01T02:40:45.656Z",
 *                   "updatedAt": "2025-04-01T02:40:45.656Z",
 *                   "deletedAt": null
 *                 },
 *                 {
 *                   "id": "2defb6bd-cd68-4657-bc63-38e071c8770f",
 *                   "idx": 71,
 *                   "translationId": "02f43933-41fb-4dd5-8426-700f17beb6fa",
 *                   "userId": "user-9",
 *                   "userNickname": "태일윈드너구리",
 *                   "userProfileImg": null,
 *                   "content": "구체적인 예시 덕분에 이해가 쉬웠어요!",
 *                   "createdAt": "2025-04-01T02:40:45.656Z",
 *                   "updatedAt": "2025-04-01T02:40:45.656Z",
 *                   "deletedAt": null
 *                 }
 *               ]
 *       400:
 *         description: 존재하지 않는 translationId
 *       500:
 *         description: 서버 오류
 */
const getFeedBackList: GetController<
  GetFeedBackListParams,
  never,
  GetFeedbackListResponse
> = async (req, res, next) => {
  const translationId = req.params.translationId;

  const existedTranslaition = await FeedbackService.checkTranslations(
    translationId
  );

  if (!existedTranslaition) {
    return next({ statusCode: 400, message: '존재하지 않는 translationId' });
  }

  const feedbacks = await FeedbackService.fetchFeedbackList(
    existedTranslaition.id
  );

  res.status(200).json({
    feedbacks: feedbacks,
  });
  return;
};

export default {
  getFeedBackList,
};
