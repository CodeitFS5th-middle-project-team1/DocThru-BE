import { Router } from 'express';
import FeedbackRouter from '../feedbacks/feedbacks.routes';
import LikeRouter from '../likes/likes.routes';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  TranslationParamsSchema,
  TranslationListQuerySchema,
  TranslationRequestBody,
  TranslationParamsWithIdSchema,
} from './translations.types';
import TranslationsController from './translations.controller';
const router = Router({ mergeParams: true });

router.get('/', TranslationsController.getTranslationList); // 작업물 목록
router.post('/', TranslationsController.postTranslation); // 작업물 생성
router.get('/:translationId', TranslationsController.getTranslationById); // 작업물 상세 조회
router.patch('/:translationId'); // 작업물 수정
router.delete('/:translationId'); // 작업물 삭제
router.post('/draftedTranslations'); // 작업물 임시 저장
router.get('/draftedTranslations'); // 작업물 임시 저장 가져오기
router.use('/:translationId/feedbacks', FeedbackRouter);
router.use('/:translationId', LikeRouter);

export default router;
