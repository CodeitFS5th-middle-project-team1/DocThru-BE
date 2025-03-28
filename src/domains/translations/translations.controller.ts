import { Controller } from '../../types/express';
import TranslationsService from './translations.service';
import {
  TranslationListResponse,
  CreateTranslationResponse,
  UpdateTranslationResponse,
} from './translations.types';

/**
 * @swagger
 *  /api/challenges/{challengeId}/translations:
 *   get:
 *     summary: 챌린지에 속한 번역물 목록 조회
 *     description: 특정 챌린지에 속한 번역물 목록을 추천수 순으로 정렬하여 조회합니다.페이지네이션을 지원합니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: 한 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 번역물 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 translations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       challengeId:
 *                         type: string
 *                       likeCount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalCount:
 *                   type: integer
 *                   description: 전체 번역물 개수
 *                 message:
 *                   type: string
 *                   example: 번역물
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Challenge ID is required
 *       500:
 *         description: 서버 오류
 */
const getTranslations: Controller = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!challengeId) {
      return next({ statusCode: 400, message: 'Challenge ID is required' });
    }

    const { translations, totalCount }: TranslationListResponse =
      await TranslationsService.getTranslations({
        challengeId,
        page,
        limit,
      });

    res.status(200).json({
      translations,
      totalCount,
      message: '번역물',
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @swagger
 *  /api/challenges/{challengeId}/translations:
 *   post:
 *     summary: 번역 작업물 생성 (제출)
 *     description: 사용자가 완성한 번역 작업물을 제출합니다. 제목, 내용, 사용자 ID가 필요합니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 작업물에 대한 챌린지 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 번역 작업물 제목
 *                 example: "NEXT.js 기술문서 번역본"
 *               content:
 *                 type: string
 *                 description: 번역 작업물 내용
 *                 example: "번역된 내용이 여기에 들어갑니다."
 *               userId:
 *                 type: string
 *                 description: 작업물을 생성한 사용자 ID
 *                 example: "user-12"
 *     responses:
 *       201:
 *         description: 번역 작업물 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: 요청 성공 여부
 *                 message:
 *                   type: string
 *                   example: "Translation created successfully"
 *                   description: 성공 메시지
 *                 translation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 생성된 번역물의 ID
 *                     title:
 *                       type: string
 *                       description: 번역물 제목
 *                     content:
 *                       type: string
 *                       description: 번역물 내용
 *                     userId:
 *                       type: string
 *                       description: 생성한 사용자 ID
 *                     challengeId:
 *                       type: string
 *                       description: 속한 챌린지 ID
 *                     likeCount:
 *                       type: integer
 *                       description: 좋아요 수 (초기값 0)
 *                       example: 0
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 생성 일시
 *
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: 챌린지 또는 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Challenge with ID {challengeId} not found"
 *       500:
 *         description: 서버 오류
 */
const createTranslation: Controller = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { title, content, userId } = req.body;

    // 요청 데이터 검증
    if (!title || !content || !userId) {
      return next({ statusCode: 400, message: 'Missing required fields' });
    }

    const translation: CreateTranslationResponse =
      await TranslationsService.createTranslation({
        title,
        content,
        userId,
        challengeId,
      });

    res.status(201).json({
      translation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges/{challengeId}/translations/{translationId}:
 *   patch:
 *     summary: 번역 작업물 수정
 *     description: 기존에 생성된 번역 작업물의 제목 또는 내용을 수정합니다. 작성자 본인만 수정할 수 있습니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 번역물이 속한 챌린지 ID
 *       - in: path
 *         name: translationId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 번역물의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 번역물 제목
 *                 example: "수정된 번역물 제목"
 *               content:
 *                 type: string
 *                 description: 수정할 번역물 내용
 *                 example: "수정된 번역물 내용입니다."
 *               userId:
 *                 type: string
 *                 description: 요청자 ID (작성자 본인이어야 함)
 *                 example: "user-12"
 *                 required: true
 *     responses:
 *       200:
 *         description: 번역 작업물 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                   description: 요청 성공 여부
 *                 message:
 *                   type: string
 *                   example: "작업물 수정 성공"
 *                   description: 성공 메시지
 *                 translation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 번역물 ID
 *                       example: "translation-123"
 *                     title:
 *                       type: string
 *                       description: 수정된 번역물 제목
 *                       example: "수정된 번역물 제목"
 *                     content:
 *                       type: string
 *                       description: 수정된 번역물 내용
 *                       example: "수정된 번역물 내용입니다."
 *                     userId:
 *                       type: string
 *                       description: 작성자 ID
 *                       example: "user-12"
 *                     challengeId:
 *                       type: string
 *                       description: 속한 챌린지 ID
 *                       example: "challenge-456"
 *                     likeCount:
 *                       type: integer
 *                       description: 좋아요 수
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 생성 일시
 *                       example: "2023-05-15T09:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 수정 일시
 *                       example: "2023-05-16T10:30:00Z"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "제목 또는 내용을 입력해주세요."
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "본인이 작성한 작업물만 수정이 가능합니다."
 *       404:
 *         description: 번역물을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "작업물 ID {translationId}를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 */

const updateTranslation: Controller = async (req, res, next) => {
  try {
    const { translationId, challengeId } = req.params;
    const { title, content, userId } = req.body;

    if (!challengeId) {
      return next({ statusCode: 400, message: 'Challenge ID is required' });
    }

    if (!translationId) {
      return next({ statusCode: 400, message: 'Translation ID is required' });
    }

    if (!userId) {
      return next({ statusCode: 400, message: 'User ID is required' });
    }

    // 수정할 내용이 있는지 확인
    // TODO: title, content 둘 중 하나만 있으면 수정이 되게하는것인지
    // 빈값인지 확인하는 것과 변경인지 확인하는 것의 차이
    if (!title && !content) {
      return next({
        statusCode: 400,
        message: '제목 또는 내용을 입력해주세요.',
      });
    }

    // 서비스 호출
    const updatedTranslation: UpdateTranslationResponse =
      await TranslationsService.updateTranslation(
        translationId,
        userId,
        challengeId,
        { title, content }
      );

    res.status(200).send({
      translation: updatedTranslation,
    });
  } catch (err) {
    next(err);
  }
};

const TranslationsController = {
  createTranslation,
  getTranslations,
  updateTranslation,
};

export default TranslationsController;
