import { RequestHandler, Router } from 'express';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
import { validateRequestData } from '../../middleware/validateRequestData';
import { TranslationParamsSchema } from '../translations/translations.types';
import { DraftTranslationRequestBodySchema } from './drafts.type';
import DraftsController from './drafts.controller';
const router = Router({ mergeParams: true });
router.post(
  '/',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsSchema,
    body: DraftTranslationRequestBodySchema,
  }),
  DraftsController.createOrUpdateDraftTranslation as unknown as RequestHandler
); // 작업물 임시 저장

router.get(
  '/',
  verifyJWTToken,
  validateRequestData({
    params: TranslationParamsSchema,
  }),
  DraftsController.getDraftTranslation as unknown as RequestHandler
);
// 작업물 임시 저장 가져오기
export default router;
