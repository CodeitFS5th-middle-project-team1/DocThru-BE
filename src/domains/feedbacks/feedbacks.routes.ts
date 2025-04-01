import { Router } from 'express';
import FeedbackController from './feedbacks.controller';
import { validateRequestData } from '../../middleware/validateRequestData';
import { GetFeedBackListSchema } from './feedbacks.validation';

const router = Router({ mergeParams: true });

router.get(
  '/',
  validateRequestData({ params: GetFeedBackListSchema }),
  FeedbackController.getFeedBackList
); // 피드백 조회
router.post('/'); // 피드백 생성
router.patch('/:feedbackId'); // 피드백 수정
router.delete('/:feedbackId'); // 피드백 삭제

export default router;
