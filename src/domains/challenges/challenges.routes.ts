import { Router } from 'express';
import TranslationRouter from '../translations/translations.routes';
import ParticipationRouter from '../participants/participants.routes';
import ChallengesAdminRouter from '../challenges_admin/challenges.admin.routes';
import ChallengesController from './challenges.controller';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  ChallengeBodySchema,
  ChallengeParamsSchema,
  ChallengeQueriesSchema,
} from './challenges.validation';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
const router = Router();

router.get(
  '/',
  validateRequestData({ query: ChallengeQueriesSchema }),
  ChallengesController.getChallengeList
); //챌린지 목록 조회
router.get(
  '/user',
  verifyJWTToken,
  validateRequestData({ query: ChallengeQueriesSchema }),
  ChallengesController.getChallengeListByUser
); // 유저의 챌린지 신청 기록 조회
router.get(
  '/manage',
  verifyJWTToken,
  validateRequestData({ query: ChallengeQueriesSchema }),
  ChallengesController.getChallengeListByAdmin
);
router.post(
  '/',
  verifyJWTToken,
  validateRequestData({ body: ChallengeBodySchema }),
  ChallengesController.postChallenge
); //챌린지 신청
router.patch(
  '/:challengeId',
  verifyJWTToken,
  validateRequestData({
    params: ChallengeParamsSchema,
    body: ChallengeBodySchema,
  }),
  ChallengesController.patchChallenge
); //챌린지 수정
router.delete(
  '/:challengeId',
  verifyJWTToken,
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesController.deleteChallenge
); //챌린지 삭제
router.get(
  '/:challengeId',
  verifyJWTToken,
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesController.getChallenge
); //챌린지 상세 조회

router.use('/:challengeId/admin', ChallengesAdminRouter);
router.use('/:challengeId/translations', TranslationRouter);
router.use('/:challengeId/participants', ParticipationRouter);

export default router;
