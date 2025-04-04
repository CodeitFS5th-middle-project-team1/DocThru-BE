import draftsService from './drafts.service';
import { DraftTranslationResponse } from './drafts.types';
/**
 * @swagger
 * /api/challenges/{challengeId}/draftTranslations:
 *   post:
 *     summary: 번역물 임시 저장 또는 업데이트
 *     description: 현재 작업 중인 번역물을 임시 저장합니다. 이미 임시 저장된 번역물이 있으면 업데이트합니다.
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 임시 저장할 번역물의 제목
 *                 example: "영어 번역 진행 중"
 *               content:
 *                 type: string
 *                 description: 임시 저장할 번역물의 내용
 *                 example: "이것은 임시저장된 번역물 내용입니다."
 *     responses:
 *       200:
 *         description: 임시 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 임시 저장된 번역물 ID
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   description: 제목
 *                   example: "영어 번역 진행 중"
 *                 content:
 *                   type: string
 *                   description: 내용
 *                   example: "이것은 임시저장된 번역물 내용입니다."
 *                 userId:
 *                   type: string
 *                   description: 사용자 ID
 *                   example: "user-123"
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                   example: "challenge-456"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-07T10:15:30Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-07T10:20:45Z"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "요청 형식이 올바르지 않습니다"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "챌린지 ID challenge-456를 찾을 수 없거나 이미 삭제되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */

import { GetController, PostController } from '../../types/express';
import ChallengesService from '../challenges/challenges.service';
import { TranslationRequestParams } from '../translations/translations.types';

const createOrUpdateDraftTranslation: PostController<
  TranslationRequestParams,
  { title?: string; content?: string; userId?: string },
  DraftTranslationResponse
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { title, content, userId: bodyUserId } = req.body;

    // req.user?.id가 있으면 사용, 없으면 요청 본문의 userId 사용 (개발용)
    const userId = req.user?.id || bodyUserId;

    if (!userId) {
      res.status(401).json({
        // return 키워드 제거
        success: false,
        message: '인증이 필요합니다.',
      });
      return; // 함수 실행 종료
    }

    const result = await draftsService.createOrUpdateDraftTranslation({
      title,
      content,
      userId,
      challengeId,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/challenges/{challengeId}/draftTranslations:
 *   get:
 *     summary: 임시 저장된 번역물 조회
 *     description: 현재 로그인한 사용자의 특정 챌린지에 대한 임시 저장 번역물을 조회합니다.
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *     responses:
 *       200:
 *         description: 임시 저장 번역물 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 임시 저장된 번역물 ID
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 title:
 *                   type: string
 *                   description: 제목
 *                   example: "영어 번역 진행 중"
 *                 content:
 *                   type: string
 *                   description: 내용
 *                   example: "이것은 임시저장된 번역물 내용입니다."
 *                 userId:
 *                   type: string
 *                   description: 사용자 ID
 *                   example: "user-123"
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                   example: "challenge-456"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-07T10:15:30Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-07T10:20:45Z"
 *       204:
 *         description: 임시 저장된 번역물이 없음
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "챌린지 ID challenge-456를 찾을 수 없거나 이미 삭제되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */
/**
 * 임시 저장 번역물 조회
 */
const getDraftTranslation: GetController<
  TranslationRequestParams,
  {},
  DraftTranslationResponse | null
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '인증이 필요합니다.',
      });
      return;
    }

    const result = await draftsService.getDraftTranslation({
      userId,
      challengeId,
    });

    if (!result) {
      res.status(204).end();
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  createOrUpdateDraftTranslation,
  getDraftTranslation,
};
