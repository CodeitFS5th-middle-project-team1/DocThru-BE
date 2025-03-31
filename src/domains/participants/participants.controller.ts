import { GetController } from "../../types/express";
import ParticipantsService from "./participants.service";
import { ParticipantsRequestParams, ParticipantsRequestQueries } from "./participants.validation";

/**
 * @swagger
 * /api/challenges/{challengeId}/participants:
 *   get:
 *     tags:
 *       - Participants
 *     summary: 챌린지 참여자 조회
 *     description: 특정 챌린지에 참여한 사용자 목록을 조회합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: "조회할 챌린지의 ID"
 *         schema:
 *           type: string
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: query
 *         name: page
 *         required: false
 *         description: "페이지 번호 (기본값: 1)"
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: "한 페이지에 표시할 참여자 수 (기본값: 5)"
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: 챌린지 참여자 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 participants:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: "참여자의 사용자 ID"
 *                         example: "user-1"
 *                       challengeId:
 *                         type: string
 *                         description: "챌린지 ID"
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       likeCount:
 *                         type: integer
 *                         description: "사용자가 해당 챌린지에서 받은 좋아요 수"
 *                         example: 5
 *                 totalCount:
 *                   type: integer
 *                   description: "전체 참여자 수"
 *                   example: 20
 *       400:
 *         description: 잘못된 요청 데이터
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: "응답 코드"
 *                   example: 400
 *                 message:
 *                   type: string
 *                   description: "에러 메시지"
 *                   example: "Invalid request parameters"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: "응답 코드"
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: "에러 메시지"
 *                   example: "Challenge not found"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: "응답 코드"
 *                   example: 500
 *                 message:
 *                   type: string
 *                   description: "에러 메시지"
 *                   example: "Internal server error"
 */
const getParticipants: GetController<ParticipantsRequestParams, ParticipantsRequestQueries, any> = async (req , res , next) => {
  try {
    const id = req.params.challengeId;
    const { limit, page } = req.query;
    const result = await ParticipantsService.getParticipants({id, page, limit});
    res.status(200).send(result)
  } catch (err) {
    next(err);
  }
}

const ParticipantsController = {
  getParticipants,
}

export default ParticipantsController;