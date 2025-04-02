import { PatchController } from '../../types/express';
import {
  ChallengeAdminParams,
  ChallengeAdminRejectBody,
} from './challenges.admin.validation';
import ChallengesAdminService from './challenges.admin.service';
import { ChallengeAdminResponse } from './challenges.admin.type';

/**
 * @swagger
 * /api/challenges/{challengeId}/admin/approve:
 *   patch:
 *     tags:
 *       - Challenges Admin
 *     summary: 관리자 챌린지 승인
 *     description: 관리자가 챌린지를 승인하는 API
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 챌린지 승인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "0896ee06-e338-41e4-b006-d7c3fe726bf0"
 *                     idx:
 *                       type: number
 *                       example: 38
 *                     field:
 *                       type: string
 *                       enum: ["CAREER"]
 *                       example: "CAREER"
 *                     userId:
 *                       type: string
 *                       example: "user-13"
 *                     title:
 *                       type: string
 *                       example: "포트폴리오 작성 팁 문서 번역"
 *                     originURL:
 *                       type: string
 *                       example: "https://example.com/docs/more-12"
 *                     documentType:
 *                       type: string
 *                       enum: ["BLOG"]
 *                       example: "BLOG"
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T00:00:00.000Z"
 *                     maxParticipants:
 *                       type: number
 *                       example: 6
 *                     currentParticipants:
 *                       type: number
 *                       example: 1
 *                     description:
 *                       type: string
 *                       example: "포트폴리오 작성 팁 문서 번역에 대한 협업 번역 챌린지입니다."
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-25T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-02T08:25:14.386Z"
 *                     deletedReason:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     rejectedReason:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     rejectedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
 *                     approvalStatus:
 *                       type: string
 *                       enum: ["APPROVED"]
 *                       example: "APPROVED"
 *                     approvalAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-02T08:25:14.386Z"
 *                     isParticipantsFull:
 *                       type: boolean
 *                       example: false
 *                     isDeadlineFull:
 *                       type: boolean
 *                       example: false
 *       403:
 *         description: 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "관리자 권한이 없습니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "챌린지를 찾을 수 없습니다."
 */
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

const patchChallengeReject: PatchController<
  ChallengeAdminParams,
  ChallengeAdminRejectBody,
  ChallengeAdminResponse
> = async (req, res, next) => {
  const userRole = req.user?.role;

  if (userRole !== 'ADMIN') {
    return next({ statusCode: 403, message: '관리자 권한이 없습니다.' });
  }

  const challengeId = req.params.challengeId;
  const { rejectedReason } = req.body;

  const challenge = await ChallengesAdminService.checkChallenge(challengeId);

  if (!challenge) {
    return next({ statusCode: 404, message: '챌린지를 찾을 수 없습니다.' });
  }

  const updateChallenge = await ChallengesAdminService.rejectChallenge(
    challengeId,
    rejectedReason
  );

  res.status(200).json({ challenge: updateChallenge });
  return;
};

export default {
  patchChallengeApprove,
  patchChallengeReject,
};
