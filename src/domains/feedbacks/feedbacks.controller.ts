import {
  DeleteController,
  GetController,
  PatchController,
  PostController,
} from '../../types/express';
import {
  FeedBackParams,
  ModifyFeedBackParams,
  PostFeedBackBodyParams,
} from './feedbacks.validation';
import FeedbackService from './feedbacks.service';
import {
  DeleteFeedBackResponse,
  GetFeedbackListResponse,
  PatchFeedBackResponse,
  PostFeedBackResponse,
} from './feedbacks.type';
import AuthService from '../auth/auth.service';

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
  FeedBackParams,
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

/**
 * @swagger
 * /api/translations/{translationId}/feedbacks:
 *   post:
 *     tags:
 *       - Feedbacks
 *     summary: 번역에 대한 피드백 생성
 *     description: 특정 번역에 대한 피드백을 생성합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 피드백을 생성할 번역의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 피드백 내용
 *     responses:
 *       201:
 *         description: 피드백이 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 생성된 피드백 ID
 *                     idx:
 *                       type: integer
 *                       description: 피드백 인덱스
 *                     translationId:
 *                       type: string
 *                       description: 피드백이 달린 번역 ID
 *                     userId:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 ID
 *                     userNickname:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 닉네임
 *                     userProfileImg:
 *                       type: string
 *                       nullable: true
 *                       description: 피드백을 작성한 사용자 프로필 이미지
 *                     content:
 *                       type: string
 *                       description: 피드백 내용
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 작성 시간
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 수정 시간
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: 피드백 삭제 시간
 *             example:
 *               feedback:
 *                 id: "4b40576d-7eaf-4d3c-a577-918ebd55905c"
 *                 idx: 3
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 userNickname: "codeit"
 *                 userProfileImg: null
 *                 content: "테스트 피드백 우리지금만나 아 당장만나 우리지금만나 아 당장만나"
 *                 createdAt: "2025-04-01T08:09:43.305Z"
 *                 updatedAt: "2025-04-01T08:09:43.305Z"
 *                 deletedAt: null
 *       400:
 *         description: 존재하지 않는 translationId 또는 유저
 *       500:
 *         description: 서버 오류
 */
const postFeedback: PostController<
  FeedBackParams,
  PostFeedBackBodyParams,
  PostFeedBackResponse
> = async (req, res, next) => {
  const translationId = req.params.translationId;
  const { content } = req.body;
  const userId = req.user?.id ?? '';

  const existedTranslaition = await FeedbackService.checkTranslations(
    translationId
  );

  if (!existedTranslaition) {
    return next({ statusCode: 400, message: '존재하지 않는 translationId' });
  }

  const existedUser = await AuthService.checkId(userId);

  if (!existedUser) {
    return next({ statusCode: 400, message: '존재하지 않는 유저' });
  }

  const feedback = await FeedbackService.createFeedback({
    translationId,
    userId: existedUser.id,
    userNickName: existedUser.nickname,
    content,
  });

  res.status(201).json({
    feedback,
  });
  return;
};

/**
 * @swagger
 * /api/translations/{translationId}/feedbacks/{feedbackId}:
 *   patch:
 *     tags:
 *       - Feedbacks
 *     summary: 번역에 대한 피드백 수정
 *     description: 특정 번역에 대한 피드백을 수정합니다. 피드백 작성자 또는 관리자만 수정 가능합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 피드백이 달린 번역의 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         description: 수정할 피드백의 ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 피드백 내용
 *     responses:
 *       200:
 *         description: 피드백이 성공적으로 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 피드백 ID
 *                     idx:
 *                       type: integer
 *                       description: 피드백 인덱스
 *                     translationId:
 *                       type: string
 *                       description: 피드백이 달린 번역 ID
 *                     userId:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 ID
 *                     userNickname:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 닉네임
 *                     userProfileImg:
 *                       type: string
 *                       nullable: true
 *                       description: 피드백을 작성한 사용자 프로필 이미지
 *                     content:
 *                       type: string
 *                       description: 수정된 피드백 내용
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 작성 시간
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 수정 시간
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: 피드백 삭제 시간
 *             example:
 *               feedback:
 *                 id: "4b40576d-7eaf-4d3c-a577-918ebd55905c"
 *                 idx: 3
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 userNickname: "codeit"
 *                 userProfileImg: null
 *                 content: "수정된 피드백 내용입니다."
 *                 createdAt: "2025-04-01T08:09:43.305Z"
 *                 updatedAt: "2025-04-01T08:30:00.000Z"
 *                 deletedAt: null
 *       400:
 *         description: 존재하지 않는 feedbackId
 *       403:
 *         description: 권한이 없음 (피드백 작성자 또는 관리자가 아님)
 *       500:
 *         description: 서버 오류
 */
const patchFeedback: PatchController<
  ModifyFeedBackParams,
  PostFeedBackBodyParams,
  PatchFeedBackResponse
> = async (req, res, next) => {
  const feedbackId = req.params.feedbackId;
  const { content } = req.body;
  const userId = req.user?.id ?? '';
  const userRole = req.user?.role ?? 'USER';

  const existedFeedback = await FeedbackService.checkFeedbackByID(feedbackId);

  if (!existedFeedback) {
    return next({ statusCode: 400, message: '존재하지 않는 feedbackId' });
  }

  if (existedFeedback.userId !== userId && userRole !== 'ADMIN') {
    return next({ statusCode: 403, message: '권한이 없습니다.' });
  }

  const updatedFeedback = await FeedbackService.updateFeedback(
    feedbackId,
    content
  );

  res.status(200).json({
    feedback: updatedFeedback,
  });
  return;
};

/**
 * @swagger
 * /api/translations/{translationId}/feedbacks/{feedbackId}:
 *   delete:
 *     tags:
 *       - Feedbacks
 *     summary: 번역에 대한 피드백 삭제
 *     description: 특정 번역에 대한 피드백을 삭제합니다. 피드백 작성자 또는 관리자만 삭제 가능합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 피드백이 달린 번역의 ID
 *         schema:
 *           type: string
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         description: 삭제할 피드백의 ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 피드백이 성공적으로 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 feedback:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 피드백 ID
 *                     idx:
 *                       type: integer
 *                       description: 피드백 인덱스
 *                     translationId:
 *                       type: string
 *                       description: 피드백이 달린 번역 ID
 *                     userId:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 ID
 *                     userNickname:
 *                       type: string
 *                       description: 피드백을 작성한 사용자 닉네임
 *                     userProfileImg:
 *                       type: string
 *                       nullable: true
 *                       description: 피드백을 작성한 사용자 프로필 이미지
 *                     content:
 *                       type: string
 *                       description: 피드백 내용
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 작성 시간
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 수정 시간
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 피드백 삭제 시간
 *             example:
 *               feedback:
 *                 id: "4b40576d-7eaf-4d3c-a577-918ebd55905c"
 *                 idx: 3
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 userId: "a7a54ed2-53be-4931-b8f4-f87bd4358adf"
 *                 userNickname: "codeit"
 *                 userProfileImg: null
 *                 content: "삭제된 피드백입니다."
 *                 createdAt: "2025-04-01T08:09:43.305Z"
 *                 updatedAt: "2025-04-01T08:30:00.000Z"
 *                 deletedAt: "2025-04-01T09:00:00.000Z"
 *       400:
 *         description: 존재하지 않는 feedbackId
 *       403:
 *         description: 권한이 없음 (피드백 작성자 또는 관리자가 아님)
 *       500:
 *         description: 서버 오류
 */
const deleteFeedback: DeleteController<
  ModifyFeedBackParams,
  never,
  DeleteFeedBackResponse
> = async (req, res, next) => {
  const feedbackId = req.params.feedbackId;
  const userId = req.user?.id ?? '';
  const userRole = req.user?.role ?? 'USER';

  const existedFeedback = await FeedbackService.checkFeedbackByID(feedbackId);

  if (!existedFeedback) {
    return next({ statusCode: 400, message: '존재하지 않는 feedbackId' });
  }

  if (existedFeedback.userId !== userId && userRole !== 'ADMIN') {
    return next({ statusCode: 403, message: '권한이 없습니다.' });
  }

  const deletedFeedback = await FeedbackService.deleteFeedback(feedbackId);

  res.status(204).json({
    feedback: deletedFeedback,
  });
  return;
};

export default {
  getFeedBackList,
  postFeedback,
  patchFeedback,
  deleteFeedback,
};
