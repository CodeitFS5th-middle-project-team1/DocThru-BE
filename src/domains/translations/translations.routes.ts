import { Router, RequestHandler } from 'express';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  TranslationParamsSchema,
  TranslationListQuerySchema,
  TranslationRequestBody,
  TranslationParamsWithIdSchema,
  TranslationUpdateBodySchema,
} from './translations.types';
import FeedbackRouter from '../feedbacks/feedbacks.routes';
import LikeRouter from '../likes/likes.routes';
import TranslationsController from './translations.controller';
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
  validateRequestData({
    params: TranslationParamsSchema,
    body: TranslationRequestBody,
  }),
  TranslationsController.postTranslation
);

router.get(
  '/:translationId',
  validateRequestData({
    params: TranslationParamsWithIdSchema,
  }),
  TranslationsController.getTranslationById
);
router.patch('/:translationId'); // 작업물 수정
router.delete('/:translationId'); // 작업물 삭제
router.post('/draftedTranslations'); // 작업물 임시 저장
router.get('/draftedTranslations'); // 작업물 임시 저장 가져오기
router.use('/:translationId/feedbacks', FeedbackRouter);
router.use('/:translationId', LikeRouter);

export default router;
