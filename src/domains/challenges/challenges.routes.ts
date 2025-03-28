import { Router } from 'express';
import TranslationRouter from '../translations/translations.routes';
import ParticipationRouter from '../participants/participants.routes';
import ChallengesController from './challenges.controller';
const router = Router();

router.get('/', ChallengesController.getChallengeList); //챌린지 목록 조회
// router.post('/', ChallengesController.postChallenge); //챌린지 신청
router.patch('/:challengeId'); //챌린지 수정
router.delete('/:challengeId'); //챌린지 삭제
router.get('/:challengeId', ChallengesController.getChallenge); //챌린지 상세 조회
router.patch('/:challengeId/approve'); //챌린지 승인
router.patch('/:challengeId/reject'); //챌린지 거절
router.use('/:challengeId/translations', TranslationRouter);
router.use('/:challengeId/participants', ParticipationRouter);

export default router;
