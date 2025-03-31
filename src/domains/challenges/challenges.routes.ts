import { Router } from 'express';
import TranslationRouter from '../translations/translations.routes';
import ParticipationRouter from '../participants/participants.routes';
import ChallengesController from './challenges.controller';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  ChallengeBodySchema,
  ChallengeParamsSchema,
  ChallengeQueriesSchema,
} from './challenges.validation';
const router = Router();

router.get(
  '/',
  validateRequestData({ params: ChallengeQueriesSchema }),
  ChallengesController.getChallengeList
); //챌린지 목록 조회
router.post(
  '/',
  validateRequestData({ body: ChallengeBodySchema }),
  ChallengesController.postChallenge
); //챌린지 신청
router.patch(
  '/:challengeId',
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesController.updateChallenge
); //챌린지 수정
router.delete(
  '/:challengeId',
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesController.deleteChallenge
); //챌린지 삭제
router.get(
  '/:challengeId',
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesController.getChallenge
); //챌린지 상세 조회
router.patch('/:challengeId/approve'); //챌린지 승인
router.patch('/:challengeId/reject'); //챌린지 거절
router.use('/:challengeId/translations', TranslationRouter);
router.use('/:challengeId/participants', ParticipationRouter);

export default router;
