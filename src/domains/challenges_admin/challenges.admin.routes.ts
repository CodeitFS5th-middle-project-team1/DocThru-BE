import { Router } from 'express';
import ChallengesAdminController from './challenges.admin.controller';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';
import { validateRequestData } from '../../middleware/validateRequestData';
import {
  ChallengeAdminParamsSchema,
  ChallengeAdminRejectBodySchema,
} from './challenges.admin.validation';
const router = Router({ mergeParams: true });

router.use(verifyJWTToken);

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
router.patch('/remove'); //챌린지 삭제

export default router;
