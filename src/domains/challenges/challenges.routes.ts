import { Router } from 'express';
import TranslationRouter from '../translations/translations.routes';
import ParticipationRouter from '../participants/participants.routes';
import ChallengesController from './challenges.controller';
const router = Router();

/**
 * @swagger
 * /api/challenges:
 *   get:
 *     summary: 챌린지 목록 조회
 *     description: 챌린지 목록을 조회합니다.
 *     parameters:
 *       - name: documentType
 *         in: query
 *         description: 문서 타입을 입력합니다.
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Blog, OFFICIAL]  # 가능한 값들을 열거
 *       - name: fields
 *         in: query
 *         description: 필드를 입력해주세요. (카테고리)
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [NEXTJS, MODERNJS, API, WEB, CAREER]  # 가능한 값들
 *       - name: approvalStatus
 *         in: query
 *         description: The approval status of the challenge
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]  # 가능한 값들
 *       - name: keyword
 *         in: query
 *         description: Keyword to search in the title or description
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 챌린지 리스트를 출력합니다.
 *       400:
 *         description: 사용자 입력 오류
 *       500:
 *         description: 서버 오류
 */
router.get('/', ChallengesController.getChallenges); //챌린지 목록 조회
router.post('/'); //챌린지 신청
router.patch('/:challengeId'); //챌린지 수정
router.delete('/:challengeId'); //챌린지 삭제
router.get('/:challengeId'); //챌린지 상세 조회
router.patch('/:challengeId/approve'); //챌린지 승인
router.patch('/:challengeId/reject'); //챌린지 거절

router.use('/:challengeId/translations', TranslationRouter);
router.use('/:challengeId/participants', ParticipationRouter);
export default router;
