import { Router } from 'express';
import FeedbackController from './feedbacks.controller';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  FeedBackSchema,
  ModifyFeedBackSchema,
  PostFeedBackBodySchema,
} from './feedbacks.validation';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';

const router = Router({ mergeParams: true });

router.use(verifyJWTToken);

router.get(
  '/',
  validateRequestData({ params: FeedBackSchema }),
  FeedbackController.getFeedBackList
); // 피드백 조회
router.post(
  '/',
  validateRequestData({ params: FeedBackSchema, body: PostFeedBackBodySchema }),
  FeedbackController.postFeedback
); // 피드백 생성
router.patch(
  '/:feedbackId',
  validateRequestData({
    params: ModifyFeedBackSchema,
    body: PostFeedBackBodySchema,
  }),
  FeedbackController.patchFeedback
); // 피드백 수정
router.delete(
  '/:feedbackId',
  validateRequestData({ params: ModifyFeedBackSchema }),
  FeedbackController.deleteFeedback
); // 피드백 삭제

export default router;
