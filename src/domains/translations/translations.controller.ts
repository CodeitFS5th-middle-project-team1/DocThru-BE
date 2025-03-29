import TranslationsService from './translations.service';
import {
  GetController,
  PostController,
  DeleteController,
} from '../../types/express';
import {
  TranslationListResponse,
  ChallengeParams,
  TranslationResponse,
  GetTranslationListQuery,
  PostTranslationResponse,
} from './translations.types';
import { TranslationRequestBody } from './translations.validation';
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
  ChallengeParams,
  GetTranslationListQuery,
  TranslationListResponse
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const page = Number(req.query.page) || 1; // Number 생성자와 nullish 병합 연산자 사용
    const limit = Number(req.query.limit) || 5;

    //TODO: validation 파일로 처리?
    if (!challengeId) {
      return next({ statusCode: 400 });
    }

    const { translations, totalCount }: TranslationListResponse =
      await TranslationsService.getTranslationList({
        challengeId,
        page,
        limit,
      });

    res.status(200).send({
      translations,
      totalCount,
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
 *                   example: "잘못된 요청입니다. 요청이 올바른 형식이 아닙니다."
 *       404:
 *         description: 챌린지 또는 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "요청한 리소스를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 */
const postTranslation: PostController<
  ChallengeParams,
  TranslationRequestBody,
  { translation: PostTranslationResponse }
> = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const { title, content, userId } = req.body;
    //TODO: validation 파일로 처리?
    if (!userId) {
      return next({ statusCode: 400, message: 'User ID is required' });
    }

    const result = await TranslationsService.postTranslation({
      title,
      content,
      userId,
      challengeId,
    });

    res.status(201).send({ translation: result });
  } catch (err) {
    next(err);
  }
};

const TranslationsController = {
  postTranslation,
  getTranslationList,
};

export default TranslationsController;
