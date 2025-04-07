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
//TODO: 번역물 생성시 에러 -  챌린지 상태에 따라 필터링 필요
//이 챌린지는 참가자 수 제한으로 인해 더 이상 번역물을 제출할 수 없습니다.
//이 챌린지는 아직 승인 대기 중이므로 번역물을 제출할 수 없습니다.
//이 챌린지는 이미 종료되었습니다. 번역물을 제출할 수 없습니다.
//이미 이 챌린지에 번역물을 제출하셨습니다. 한 챌린지당 하나의 번역물만 제출할 수 있습니다.
/**
 * @swagger
 *  /api/challenges/{challengeId}/translations:
 *   post:
 *     summary: 번역 작업물 생성 (제출)
 *     description: 사용자가 특정 챌린지에 번역물을 제출합니다. 한 챌린지당 하나의 번역물만 제출 가능합니다. 챌린지 상태가 APPROVED 일때만 참여가 가능합니다. 생성 후 챌린지의 currentParticipants를 1 증가시킵니다.
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []  # 인증 필요 명시
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: 번역 작업물 제목
 *                 example: "NEXT.js 기술문서 번역본"
 *               content:
 *                 type: string
 *                 description: 번역 작업물 내용
 *                 example: "번역된 내용이 여기에 들어갑니다."
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
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "인증이 필요합니다. 로그인 후 다시 시도해주세요."
 *       403:
 *         description: 접근 거부 (챌린지 상태 문제 또는 중복 제출)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이 챌린지는 아직 승인 대기 중이므로 번역물을 제출할 수 없습니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "챌린지 ID abc123을 찾을 수 없거나 이미 삭제되었습니다."
 *       409:
 *         description: 이미 번역물 제출함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "이미 이 챌린지에 번역물을 제출하셨습니다. 한 챌린지당 하나의 번역물만 제출할 수 있습니다."
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
    const { title, content } = req.body;

    // 인증된 사용자 ID 확인
    const userId = req.user?.id;

    if (!userId) {
      res.status(403);
      return;
    }

    const result = await TranslationsService.createTranslation({
      title,
      content,
      userId, // 미들웨어에서 가져온 사용자 ID 사용
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
 *     description: 특정 번역물의 상세 정보를 조회합니다. 챌린지의 문서 타입과 분야 정보도 함께 제공합니다.
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 번역물 상세 정보
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 작성자 ID
 *                     nickname:
 *                       type: string
 *                       description: 작성자 닉네임
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                 likeCount:
 *                   type: integer
 *                   description: 좋아요 수
 *                 isLiked:
 *                   type: boolean
 *                   description: 현재 사용자의 좋아요 여부 (인증된 사용자만)
 *                 documentType:
 *                   type: string
 *                   enum: [BLOG, OFFICIAL]
 *                   description: 챌린지의 문서 타입
 *                   example: "BLOG"
 *                 field:
 *                   type: string
 *                   enum: [NEXTJS, MODERNJS, API, WEB, CAREER]
 *                   description: 챌린지의 분야
 *                   example: "NEXTJS"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성 일시
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 수정 일시
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "번역물 ID abc123을 찾을 수 없습니다."
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
 *     description: 번역물의 제목과 내용을 수정합니다. 마감기한이 지나지 않은 경우에만 작성자 본인 또는 관리자가 수정할 수 있습니다.
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []  # JWT 인증 필요 명시
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
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 제목
 *                 example: "업데이트된 번역 제목"
 *               content:
 *                 type: string
 *                 description: 수정할 내용
 *                 example: "업데이트된 번역 내용이 여기에 포함됩니다."
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 작성자 ID
 *                     nickname:
 *                       type: string
 *                       description: 작성자 닉네임
 *                 challengeId:
 *                   type: string
 *                   description: 챌린지 ID
 *                 likeCount:
 *                   type: integer
 *                   description: 좋아요 수
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성 일시
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 수정 일시
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "수정할 내용을 입력해주세요."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 또는 마감기한 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "챌린지 마감기한이 지나 수정할 수 없습니다."
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "번역물 ID를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */
const patchTranslation: PatchController<
  TranslationParamsWithId,
  TranslationUpdateBody,
  TranslationResponse
> = async (req, res, next) => {
  try {
    const { challengeId, translationId } = req.params;
    const { title, content } = req.body;

    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      next(new CustomError(401, '인증이 필요합니다.'));
      return;
    }
    const updatedTranslation = await TranslationsService.updateTranslation({
      translationId,
      challengeId,
      userId,
      userRole: userRole as UserRole,
      updateData: {
        title,
        content,
      },
    });
    res.status(200).send(updatedTranslation);
  } catch (error) {
<<<<<<< HEAD
    next(error);
=======
    next(error)
>>>>>>> 77442c71c5f968875f36fcce715a88433f08eef2
  }
};

/**
 * @swagger
 *  /api/challenges/{challengeId}/translations/{translationId}:
 *   delete:
 *     summary: 번역물 삭제
 *     description: 번역물을 삭제하고 챌린지의 참가자 수를 자동으로 감소시킵니다. 마감기한이 지나지 않은 경우에만 작성자 본인 또는 관리자가 삭제할 수 있습니다.
 *     tags: [Translations]
 *     security:
 *       - bearerAuth: []  # JWT 인증 필요 명시
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
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "이미 삭제된 챌린지의 번역물입니다."
 *       401:
 *         description: 인증 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       403:
 *         description: 권한 없음 또는 마감기한 초과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - "이 번역물에 대한 삭제 권한이 없습니다."
 *                     - "챌린지 마감기한이 지나 삭제할 수 없습니다."
 *       404:
 *         description: 번역물 또는 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "번역물 ID를 찾을 수 없거나 이미 삭제되었습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류가 발생했습니다."
 */
const deleteTranslation: DeleteController<
  TranslationParamsWithId,
  {}, // userId와 userRole은 req.user에서 가져옴
  { success: boolean; message?: string }
> = async (req, res, next) => {
  try {
    const { challengeId, translationId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      next(new CustomError(401, '인증이 필요합니다.'));
      return;
    }

    await TranslationsService.deleteTranslation({
      translationId,
      challengeId,
      userId,
      userRole: userRole as UserRole,
    });

    res.status(200).json({
      success: true,
      message: '번역물 삭제 성공',
    });
  } catch (error) {
<<<<<<< HEAD
    next(error);
=======
    // 수정된 코드
    next(error)
>>>>>>> 77442c71c5f968875f36fcce715a88433f08eef2
  }
};
const TranslationsController = {
  postTranslation,
  getTranslationList,
  getTranslationById,
  patchTranslation,
  deleteTranslation,
};

export default TranslationsController;
