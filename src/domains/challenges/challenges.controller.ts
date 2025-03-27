import ChallengesService from './challenges.service';
import { isValidEnumValue } from '../../utils/isValidEnumValue';
import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import { Controller } from '../../types/express';
import { isValidUUID } from '../../utils/isUUID';

/**
 * @swagger
 * /api/challenges/{challengeId}:
 *   get:
 *     summary: 챌린지 정보 상세 조회
 *     description: 챌린지 ID를 이용해 해당 챌린지의 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 조회할 챌린지의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공적으로 챌린지 정보를 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenge:
 *                   type: object
 *                   description: 챌린지 정보
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const getChallenge: Controller = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    if(!isValidUUID(id)){
      next({ statusCode: 400 });
      return;
    }
    const result = await ChallengesService.getChallenge(id);
    if (!result) {
      next({ statusCode: 404 });
      return;
    }
    res.status(200).send(result)
    
  } catch (err) {
    next(err);
  }
};
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
const getChallenges: Controller = async (req, res, next) => {
  try {
    const {
      documentType,
      fields,
      approvalStatus,
      keyword,
      page = '1',
      limit = '10',
    } = req.query;
    // 쿼리 구조분해 된 것들 각각 검증 필요
    if (
      documentType &&
      !isValidEnumValue(DocumentType, documentType.toString())
    ) {
      next({ statusCode: 400 });
      return;
    }

    if (
      approvalStatus &&
      !isValidEnumValue(ApprovalStatus, approvalStatus.toString())
    ) {
      next({ statusCode: 400 });
      return;
    }

    // fields 검증 (배열 형식이나 단일 값 검증)
    if (fields && !Array.isArray(fields)) {
      if (!isValidEnumValue(FieldType, fields.toString())) {
        return next({ statusCode: 400 });
      }
    } else if (Array.isArray(fields)) {
      for (const field of fields) {
        if (!isValidEnumValue(FieldType, field.toString())) {
          return next({ statusCode: 400 });
        }
      }
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      next({ statusCode: 400 });
      return;
    }

    const result = await ChallengesService.getChallenges({
      documentType: documentType as DocumentType,
      fields: fields as FieldType | FieldType[],
      approvalStatus: approvalStatus as ApprovalStatus,
      keyword: keyword as string,
      page: pageNumber,
      limit: limitNumber,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const ChallengesController = {
  getChallenges,
  getChallenge,
};

export default ChallengesController;
