import { Router } from 'express';

const router = Router();

router.get('/'); // 피드백 조회
router.post('/'); // 피드백 생성
router.patch('/:feedbackId'); // 피드백 수정
router.delete('/:feedbackId'); // 피드백 삭제

export default router;
