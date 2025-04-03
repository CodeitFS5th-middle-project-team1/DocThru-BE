import {
  GetController,
  PostController,
  DeleteController,
  PatchController,
} from '../../types/express';
import {
  TranslationListResponse,
  TranslationParamsSchema,
  TranslationResponse,
  TranslationResponseSchema,
  TranslationRequestListQuery,
  TranslationRequestBody,
  TranslationRequestParams,
  TranslationParamsWithId,
  TranslationUpdateBody,
} from './translations.types';

import { TranslationsService } from './translations.service';
import CustomError from '../../types/error';
import { UserRole } from '@prisma/client';

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
 *                   example: 잘못된 요청입니다. 요청이 올바른 형식이 아닙니다
 *       500:
 *         description: 서버 오류
 */
const getTranslationList: GetController<
  TranslationRequestParams,
  TranslationRequestListQuery,
  TranslationListResponse
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { page, limit } = req.query;

    const result = await TranslationsService.getTranslationList({
      challengeId,
      page,
      limit,
    });

    res.status(200).send({
      translations: result.translations,
      totalCount: result.totalCount,
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
 *     description: 사용자가 완성한 번역 작업물을 제출합니다. 챌린지의 참가자 수와 마감 기한을 검사하고, 번역물 생성 시 참가자 수를 자동으로 증가시킵니다.
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
 *                 id:
 *                   type: string
 *                   description: 생성된 번역물의 ID
 *                 title:
 *                   type: string
 *                   description: 번역물 제목
 *                 content:
 *                   type: string
 *                   description: 번역물 내용
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 사용자 ID
 *                     nickname:
 *                       type: string
 *                       description: 사용자 닉네임
 *                 challengeId:
 *                   type: string
 *                   description: 속한 챌린지 ID
 *                 likeCount:
 *                   type: integer
 *                   description: 좋아요 수 (초기값 0)
 *                   example: 0
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성 일시
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 수정 일시
 *       403:
 *         description: 참가자 수 제한 또는 마감 기한 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이 챌린지는 참가자 수 제한으로 인해 더 이상 번역물을 제출할 수 없습니다."
 *       404:
 *         description: 챌린지 또는 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "챌린지 ID abc123을 찾을 수 없거나 이미 삭제되었습니다."
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
const postTranslation: PostController<
  TranslationRequestParams,
  TranslationRequestBody,
  TranslationResponse
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { title, content, userId } = req.body;

    const result = await TranslationsService.createTranslation({
      title,
      content,
      userId,
      challengeId,
    });

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 *  /api/challenges/{challengeId}/translations/{translationId}:
 *   get:
 *     summary: 번역물 상세 조회
 *     description: 특정 번역물의 상세 정보를 조회합니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *       - in: path
 *         name: translationId
 *         required: true
 *         schema:
 *           type: string
 *         description: 번역물 ID
 *     responses:
 *       200:
 *         description: 번역물 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 번역물 ID
 *                 title:
 *                   type: string
 *                   description: 번역물 제목
 *                 content:
 *                   type: string
 *                   description: 번역물 내용
 *                 userId:
 *                   type: string
 *                   description: 작성자 ID
 *                 userNickname:
 *                   type: string
 *                   description: 작성자 닉네임
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                 likeCount:
 *                   type: integer
 *                   description: 좋아요 수
 *                 isLiked:
 *                   type: boolean
 *                   description: 사용자의 좋아요 여부
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성 일시
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 최종 수정 일시
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "번역물을 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 */
const getTranslationById: GetController<
  TranslationRequestParams & { translationId: string },
  { userId?: string },
  TranslationResponse & { isLiked?: boolean }
> = async (req, res, next) => {
  try {
    const { challengeId, translationId } = req.params;
    const { userId } = req.query;

    const translation = await TranslationsService.getTranslationById({
      translationId,
      challengeId,
      userId,
    });

    res.status(200).send(translation);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 *  /api/challenges/{challengeId}/translations/{translationId}:
 *   patch:
 *     summary: 번역물 수정
 *     description: 번역물의 제목과 내용을 수정합니다. 작성자 본인 또는 관리자만 수정할 수 있습니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *       - in: path
 *         name: translationId
 *         required: true
 *         schema:
 *           type: string
 *         description: 수정할 번역물 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 제목
 *                 example: "업데이트된 번역 제목"
 *               content:
 *                 type: string
 *                 description: 수정할 내용
 *                 example: "업데이트된 번역 내용이 여기에 포함됩니다."
 *               userId:
 *                 type: string
 *                 description: 요청한 사용자 ID
 *                 example: "user-123"
 *               userRole:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 description: 사용자 역할 (권한 확인)
 *                 example: "USER"
 *     responses:
 *       200:
 *         description: 번역물 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 번역물 ID
 *                 title:
 *                   type: string
 *                   description: 수정된 제목
 *                 content:
 *                   type: string
 *                   description: 수정된 내용
 *                 userId:
 *                   type: string
 *                   description: 작성자 ID
 *                 userNickname:
 *                   type: string
 *                   description: 작성자 닉네임
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                 likeCount:
 *                   type: integer
 *                   description: 좋아요 수
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 수정 일시
 *       400:
 *         description: 잘못된 요청
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "번역물 수정 권한이 없습니다."
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const updateTranslation: PatchController<
  TranslationParamsWithId,
  TranslationUpdateBody,
  TranslationResponse
> = async (req, res, next) => {
  try {
    const { challengeId, translationId } = req.params;
    const { title, content, userId, userRole } = req.body;

    const updatedTranslation = await TranslationsService.updateTranslation({
      translationId,
      challengeId,
      userId,
      userRole,
      updateData: {
        title,
        content,
      },
    });

    res.status(200).send(updatedTranslation);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      res.status(500).send({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }
};

/**
 * @swagger
 *  /api/challenges/{challengeId}/translations/{translationId}:
 *   delete:
 *     summary: 번역물 삭제
 *     description: 번역물을 삭제하고 챌린지의 참가자 수를 자동으로 감소시킵니다. 작성자 본인 또는 관리자만 삭제할 수 있습니다.
 *     tags: [Translations]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *       - in: path
 *         name: translationId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 번역물 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 요청한 사용자 ID
 *                 example: "user-123"
 *               userRole:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 description: 사용자 역할 (권한 확인)
 *                 example: "USER"
 *     responses:
 *       200:
 *         description: 번역물 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "번역물 삭제 성공"
 *       400:
 *         description: 삭제된 챌린지의 번역물
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이미 삭제된 챌린지의 번역물은 조작할 수 없습니다."
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이 번역물에 대한 삭제 권한이 없습니다."
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "번역물 ID abc123을 찾을 수 없거나 이미 삭제되었습니다."
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
const deleteTranslation: DeleteController<
  TranslationParamsWithId,
  { userId: string; userRole?: UserRole },
  { success: boolean; message?: string }
> = async (req, res, next) => {
  try {
    const { challengeId, translationId } = req.params;
    const { userId, userRole } = req.body;

    await TranslationsService.deleteTranslation({
      translationId,
      challengeId,
      userId,
      userRole,
    });

    res.status(200).json({
      success: true,
      message: '번역물 삭제 성공',
    });
  } catch (error) {
    // 수정된 코드
    if (error instanceof CustomError) {
      res.status(error.statusCode).send({ error: error.message });
    } else {
      res.status(500).send({
        success: false,
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }
};

const TranslationsController = {
  postTranslation,
  getTranslationList,
  getTranslationById,
  updateTranslation,
  deleteTranslation,
};

export default TranslationsController;
