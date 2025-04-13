import { Router, RequestHandler } from 'express';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  TranslationParamsSchema,
  TranslationListQuerySchema,
  TranslationRequestBody,
  TranslationParamsWithIdSchema,
  TranslationUpdateBodySchema,
  TranslationDeleteBodySchema,
} from './translations.types';
import FeedbackRouter from '../feedbacks/feedbacks.routes';
import LikeRouter from '../likes/likes.routes';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
import TranslationsController from './translations.controller';
import { UserRole } from '@prisma/client';
const router = Router({ mergeParams: true });

router.get(
  '/',
  validateRequestData({
    params: TranslationParamsSchema,
    query: TranslationListQuerySchema,
  }),
  TranslationsController.getTranslationList as unknown as RequestHandler
);

router.post(
  '/',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsSchema,
    body: TranslationRequestBody,
  }),
  TranslationsController.postTranslation
);

router.get(
  '/:translationId',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsWithIdSchema,
  }),
  TranslationsController.getTranslationById
);
// 번역물 수정
router.patch(
  '/:translationId',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsWithIdSchema,
    body: TranslationUpdateBodySchema,
  }),
  TranslationsController.patchTranslation as unknown as RequestHandler
);
// 번역물 삭제
router.delete(
  '/:translationId',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsWithIdSchema,
    // body: TranslationDeleteBodySchema,
  }),
  TranslationsController.deleteTranslation as unknown as RequestHandler
);

router.post('/draftedTranslations'); // 작업물 임시 저장
router.get('/draftedTranslations'); // 작업물 임시 저장 가져오기
// router.use('/:translationId/feedbacks', FeedbackRouter);

export default router;
