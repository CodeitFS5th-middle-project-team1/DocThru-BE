import { Router } from 'express';

const router = Router();
router.get('/me'); // 내 정보 조회
router.patch('/:userId/permissions'); // 유저 권한 변경경
export default router;
