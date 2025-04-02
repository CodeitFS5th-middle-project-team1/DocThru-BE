import { PatchController } from '../../types/express';
import { ChallengeAdminParams } from './challenges.admin.validation';
import ChallengesAdminService from './challenges.admin.service';
import { ChallengeAdminResponse } from './challenges.admin.type';

const patchChallengeApprove: PatchController<
  ChallengeAdminParams,
  never,
  ChallengeAdminResponse
> = async (req, res, next) => {
  const userRole = req.user?.role;

  if (userRole !== 'ADMIN') {
    return next({ statusCode: 403, message: '관리자 권한이 없습니다.' });
  }

  const challengeId = req.params.challengeId;

  const challenge = await ChallengesAdminService.checkChallenge(challengeId);

  if (!challenge) {
    return next({ statusCode: 404, message: '챌린지를 찾을 수 없습니다.' });
  }

  const updateChallenge = await ChallengesAdminService.approveChallenge(
    challengeId
  );

  res.status(200).json({ challenge: updateChallenge });
  return;
};

export default {
  patchChallengeApprove,
};
