import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send({ message: 'participants 페이지' });
});
router.post('/'); // 챌린지 참여하기
router.delete('/'); // 챌린지 참여 포기
export default router;
