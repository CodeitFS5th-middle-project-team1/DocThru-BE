import { Router } from 'express';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
import { validateRequestData } from '../../middleware/validateRequestData';
import { TranslationParamsSchema } from '../translations/translations.types';
const router = Router({ mergeParams: true });
router.post(
  '/drafts',
  validateRequestData({
    // 3. 요청 데이터 검증
    params: TranslationParamsSchema,
    body: DraftTranslationRequestBodySchema,
  }),
  DraftsController.createOrUpdateDraftTranslation as unknown as RequestHandler
); // 작업물 임시 저장

router.get(
  '/drafts',
  validateRequestData({
    params: TranslationParamsSchema,
    query: DraftTranslationQuerySchema,
  }),
  DraftsController.getDraftTranslation as unknown as RequestHandler
);
// 작업물 임시 저장 가져오기
export default router;
