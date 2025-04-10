import { DeleteController, PatchController } from '../../types/express';
import {
  ChallengeAdminParams,
  ChallengeAdminRejectBody,
} from './challenges.admin.validation';
import ChallengesAdminService from './challenges.admin.service';
import { ChallengeAdminResponse } from './challenges.admin.type';

import { createNotification } from '../notifications/notifications.service';

import {
  ChallengeRequestBody,
  ChallengeRequestParams,
} from '../challenges/challenges.validation';
import {
  DeleteChallengeResponse,
  UpdateChallengeResponse,
} from '../challenges/challenges.type';
import ChallengesService from '../challenges/challenges.service';
import challengesAdminService from './challenges.admin.service';


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

  try {
    const updateChallenge = await ChallengesAdminService.approveChallenge(
      challengeId
    );

    await createNotification({
      userId: challenge.userId,
      category: 'challenge',
      type: 'approved',
      message: `🎉 '${challenge.title}' 챌린지가 승인되었어요.`,
      challengeId: challenge.id,
    });

    res.status(200).json({ challenge: updateChallenge });
  } catch (err) {
    console.error('알림 생성 실패:', err);
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges/{challengeId}/admin/reject:
 *   patch:
 *     tags:
 *       - Challenges Admin
 *     summary: 관리자 챌린지 거절
 *     description: 관리자가 챌린지를 거절하는 API
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *         description: 챌린지 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectedReason
 *             properties:
 *               rejectedReason:
 *                 type: string
 *                 description: 챌린지 거절 사유
 *                 example: "부적절한 내용이 포함되어 있습니다."
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 챌린지 거절 성공
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
 *                       example: "부적절한 내용이 포함되어 있습니다."
 *                     rejectedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-02T08:25:14.386Z"
 *                     approvalStatus:
 *                       type: string
 *                       enum: ["REJECTED"]
 *                       example: "REJECTED"
 *                     approvalAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: null
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
  // 알림 생성
  await createNotification({
    userId: updateChallenge.userId,
    category: 'challenge',
    type: 'rejected',
    message: `'${updateChallenge.title}' 챌린지가 거절되었어요.`,
    reason: rejectedReason,
    challengeId: updateChallenge.id,
  });
  res.status(200).json({ challenge: updateChallenge });
  return;
};

/**
 * @swagger
 * /api/challenges/{challengeId}/admin/removeForce:
 *   patch:
 *     tags:
 *       - Challenges Admin
 *     summary: 관리자 전용 챌린지 삭제
 *     description: 챌린지 ID를 이용해 기존 챌린지를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 삭제할 챌린지의 ID
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: 챌린지가 성공적으로 삭제되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 응답 코드
 *                   example: 200
 *       401:
 *         description: 로그인 정보 없음
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 삭제할 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 응답 코드
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "챌린지를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 응답 코드
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "서버 오류가 발생했습니다."
 */
const deleteChallengeForce: DeleteController<
  ChallengeRequestParams,
  never,
  DeleteChallengeResponse
> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    const existChallenge = await ChallengesService.getChallenge(id);
    const authRole = req.user?.role;
    const deletedReason = req.body.deletedReason;
    if (!existChallenge.challenge) {
      next({ status: 404 });
      return;
    }
    if (authRole !== 'ADMIN') {
      next({ status: 403 });
      return;
    }
    const result = await ChallengesAdminService.deleteChallengeForce(
      id,
      deletedReason
    );
    if (!result) {
      next({ statusCode: 404 });
      return;
    }
    res.status(200).send({ code: 200 });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges/{challengeId}/admin/modify:
 *   patch:
 *     tags:
 *       - Challenges Admin
 *     summary: 관리자 전용 챌린지 수정
 *     description: 챌린지 ID를 이용해 기존 챌린지 정보를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 수정할 챌린지의 ID
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 챌린지 제목
 *                 example: "수정된 프론트엔드 번역 챌린지"
 *               description:
 *                 type: string
 *                 description: 챌린지 설명
 *                 example: "수정된 프론트엔드 관련 문서를 번역하는 챌린지입니다."
 *               documentType:
 *                 type: string
 *                 description: 문서 타입
 *                 enum: [BLOG, OFFICIAL]
 *                 example: "BLOG"
 *               field:
 *                 type: string
 *                 description: 챌린지 분야
 *                 enum: [NEXTJS, MODERNJS, API, WEB, CAREER]
 *                 example: "NEXTJS"
 *               maxParticipants:
 *                 type: integer
 *                 description: 최대 참가자 수
 *                 example: 15
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 챌린지 마감일
 *                 example: "2025-05-01T00:00:00.000Z"
 *               originURL:
 *                 type: string
 *                 format: url
 *                 description: 원본 문서 URL
 *                 example: "https://example.com/updated-doc"
 *     responses:
 *       200:
 *         description: 챌린지가 성공적으로 수정되었습니다.
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
 *                       description: 챌린지 ID
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     title:
 *                       type: string
 *                       description: 챌린지 제목
 *                       example: "수정된 프론트엔드 번역 챌린지"
 *                     description:
 *                       type: string
 *                       description: 챌린지 설명
 *                       example: "수정된 프론트엔드 관련 문서를 번역하는 챌린지입니다."
 *                     documentType:
 *                       type: string
 *                       description: 문서 타입
 *                       example: "BLOG"
 *                     field:
 *                       type: string
 *                       description: 챌린지 분야
 *                       example: "NEXTJS"
 *                     maxParticipants:
 *                       type: integer
 *                       description: 최대 참가자 수
 *                       example: 15
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       description: 챌린지 마감일
 *                       example: "2025-05-01T00:00:00.000Z"
 *                     originURL:
 *                       type: string
 *                       format: url
 *                       description: 원본 문서 URL
 *                       example: "https://example.com/updated-doc"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 마지막 업데이트 날짜
 *                       example: "2025-03-30T12:00:00.000Z"
 *       400:
 *         description: 잘못된 요청 데이터
 *       401:
 *         description: 로그인 정보 없음
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const patchChallengeForce: PatchController<
  ChallengeRequestParams,
  ChallengeRequestBody,
  UpdateChallengeResponse
> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    const authRole = req.user?.role;
    if (authRole !== 'ADMIN') {
      next({ status: 403 });
      return;
    }
    const existChallenge = await ChallengesService.getChallenge(id);
    if (!existChallenge.challenge) {
      next({ status: 404 });
      return;
    }
    const {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
    } = req.body;
    const result = await ChallengesAdminService.updateChallengeForce({
      id,
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
    });
    res.status(200).send({ challenge: result, code: 200 });
  } catch (err) {
    next(err);
  }
};

export default {
  patchChallengeApprove,
  patchChallengeReject,
  deleteChallengeForce,
  patchChallengeForce,
};
