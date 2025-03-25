import { Router } from 'express';
import TranslationRouter from '../translations/translations.routes';
import ParticipationRouter from '../participants/participants.routes';
const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'challenges' });
}); //챌린지 목록 조회
router.post('/'); //챌린지 신청
router.patch('/:challengeId'); //챌린지 수정
router.delete('/:challengeId'); //챌린지 삭제
router.get('/:challengeId'); //챌린지 상세 조회
router.patch('/:challengeId/approve', (req, res) => {
  //const { challengeId } = req.params;
  res.send(`Challenge 승인 페이지`);
});
router.patch('/:challengeId/reject', (req, res) => {
  //const { challengeId } = req.params;
  res.send(`Challenge 거절 페이지`);
});
router.use('/:challengeId/translations', TranslationRouter);
router.use('/:challengeId/participants', ParticipationRouter);
export default router;
