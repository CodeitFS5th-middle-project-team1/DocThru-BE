import { Router } from 'express';
import ChallengesAdminController from './challenges.admin.controller';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  ChallengeAdminParamsSchema,
  ChallengeAdminRejectBodySchema,
} from './challenges.admin.validation';
import {
  ChallengeBodySchema,
  ChallengeParamsSchema,
} from '../challenges/challenges.validation';
const router = Router({ mergeParams: true });

router.use(verifyJWTToken);
router.patch(
  '/removeForce',
  validateRequestData({ params: ChallengeParamsSchema }),
  ChallengesAdminController.deleteChallengeForce
); //챌린지 관리자 삭제
router.patch(
  '/approve',
  validateRequestData({ params: ChallengeAdminParamsSchema }),
  ChallengesAdminController.patchChallengeApprove
); //챌린지 승인
router.patch(
  '/reject',
  validateRequestData({
    params: ChallengeAdminParamsSchema,
    body: ChallengeAdminRejectBodySchema,
  }),
  ChallengesAdminController.patchChallengeReject
); //챌린지 거절
router.patch(
  '/modify',
  validateRequestData({
    params: ChallengeParamsSchema,
    body: ChallengeBodySchema,
  }),
  ChallengesAdminController.patchChallengeForce
);

export default router;
