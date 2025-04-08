import { DeleteController, PostController } from '../../types/express';
import likesService from './likes.service';
import { LikeResponse } from './likes.types';
import { LikeRequestParams } from './likes.validation';

/**
 * @swagger
 * /api/translations/{translationId}/like:
 *   post:
 *     tags:
 *       - Likes
 *     summary: 작업물 추천
 *     description: 특정 번역 작업물에 대해 추천(좋아요)을 등록합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 추천할 번역 작업물의 ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: 추천 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 추천 ID
 *                     translationId:
 *                       type: string
 *                       description: 번역 작업물 ID
 *                     userId:
 *                       type: string
 *                       description: 추천한 사용자 ID
 *             example:
 *               like:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 userId: "user-1"
 *       400:
 *         description: 존재하지 않는 번역물이거나 이미 추천한 작업물입니다.
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */
const postLike: PostController<LikeRequestParams, never, LikeResponse> = async (
  req,
  res,
  next
) => {
  const translationId = req.params.translationId;
  const userId = req.user?.id ?? '';
  console.log('userId', userId);

  // 존재하는 번역물인지 확인
  const translation = await likesService.checkTranslation(translationId);

  if (!translation) {
    return next({ statusCode: 400, message: '존재하지 않는 번역물입니다.' });
  }

  // 이미 좋아요를 눌렀는지 확인
  const existingLike = await likesService.checkExistingLike(
    translationId,
    userId
  );

  if (existingLike) {
    return next({ statusCode: 400, message: '이미 좋아요를 눌렀습니다.' });
  }

  // 좋아요 생성, 번역 좋아요 수 1 증가
  const like = await likesService.createLikeAndPlusTranslationLikeCount(
    translationId,
    userId
  );

  res.status(201).json({ like });
};

/**
 * @swagger
 * /api/translations/{translationId}/like:
 *   delete:
 *     tags:
 *       - Likes
 *     summary: 작업물 추천 취소
 *     description: 특정 번역 작업물에 대한 추천(좋아요)을 취소합니다.
 *     parameters:
 *       - in: path
 *         name: translationId
 *         required: true
 *         description: 추천을 취소할 번역 작업물의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 추천 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 취소된 추천 ID
 *                     translationId:
 *                       type: string
 *                       description: 번역 작업물 ID
 *                     userId:
 *                       type: string
 *                       description: 추천을 취소한 사용자 ID
 *             example:
 *               like:
 *                 id: "123e4567-e89b-12d3-a456-426614174000"
 *                 translationId: "02f43933-41fb-4dd5-8426-700f17beb6fa"
 *                 userId: "user-1"
 *       400:
 *         description: 존재하지 않는 번역물이거나 추천하지 않은 작업물입니다.
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 오류
 */
const deleteLike: DeleteController<
  LikeRequestParams,
  never,
  LikeResponse
> = async (req, res, next) => {
  const translationId = req.params.translationId;
  const userId = req.user?.id ?? '';

  const translation = await likesService.checkTranslation(translationId);

  if (!translation) {
    return next({ statusCode: 400, message: '존재하지 않는 번역물입니다.' });
  }

  const existingLike = await likesService.checkExistingLike(
    translationId,
    userId
  );

  if (!existingLike) {
    return next({ statusCode: 400, message: '좋아요를 누르지 않았습니다.' });
  }

  const likeId = existingLike.id;

  // 좋아요 삭제, 번역 좋아요 수 1 감소
  const deletedLike = await likesService.deleteLikeAndMinusTranslationLikeCount(
    likeId,
    translationId
  );

  res.status(200).json({ like: deletedLike });
};

export default {
  postLike,
  deleteLike,
};
