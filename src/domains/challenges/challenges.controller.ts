import ChallengesService from './challenges.service';
import { isValidEnumValue } from '../../utils/isValidEnumValue';
import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import { Controller } from '../../types/express';
import { isValidUUID } from '../../utils/isUUID';
import { GetChallengeParam, GetChallengeResponse } from './challenges.type';

/**
 * @swagger
 * /api/challenges/{challengeId}:
 *   get:
 *     tags:
 *       - Challenges
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
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: 챌린지 ID
 *                     field:
 *                       type: string
 *                       description: 챌린지 분야
 *                     userId:
 *                       type: string
 *                       description: 챌린지를 생성한 사용자 ID
 *                     title:
 *                       type: string
 *                       description: 챌린지 제목
 *                     originURL:
 *                       type: string
 *                       description: 원본 문서 URL
 *                     documentType:
 *                       type: string
 *                       description: 문서 타입
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       description: 챌린지 마감일
 *                     maxParticipants:
 *                       type: integer
 *                       description: 최대 참가자 수
 *                     currentParticipants:
 *                       type: integer
 *                       description: 현재 참가자 수
 *                     description:
 *                       type: string
 *                       description: 챌린지 설명
 *                     content:
 *                       type: string
 *                       description: 챌린지 내용
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: 삭제된 날짜
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: 생성된 날짜
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: 마지막 업데이트 날짜
 *                     deletedReason:
 *                       type: string
 *                       nullable: true
 *                       description: 삭제 사유
 *                     rejectedReason:
 *                       type: string
 *                       nullable: true
 *                       description: 거절 사유
 *                     approvalStatus:
 *                       type: string
 *                       description: 승인 상태
 *             example:
 *               challenge:
 *                 id: "0896ee06-e338-41e4-b006-d7c3fe726bf0"
 *                 field: "CAREER"
 *                 userId: "user-13"
 *                 title: "포트폴리오 작성 팁 문서 번역"
 *                 originURL: "https://example.com/docs/more-12"
 *                 documentType: "BLOG"
 *                 deadline: "2025-04-10T00:00:00.000Z"
 *                 maxParticipants: 6
 *                 currentParticipants: 1
 *                 description: "포트폴리오 작성 팁 문서 번역에 대한 협업 번역 챌린지입니다."
 *                 content: "포트폴리오 작성 팁 문서 번역 내용을 자연스럽게 번역하고 예시도 충실히 반영해주세요."
 *                 deletedAt: null
 *                 createdAt: "2025-03-25T00:00:00.000Z"
 *                 updatedAt: "2025-03-27T05:07:10.943Z"
 *                 deletedReason: null
 *                 rejectedReason: null
 *                 approvalStatus: "PENDING"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const getChallenge: Controller<GetChallengeParam, never, never, GetChallengeResponse> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    if (!isValidUUID(id)) {
      next({ statusCode: 400 });
      return;
    }
    const result = await ChallengesService.getChallenge(id);
    if (!result) {
      next({ statusCode: 404 });
      return;
    }
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: 챌린지 목록 조회
 *     description: 챌린지 목록을 조회합니다.
 *     parameters:
 *       - name: documentType
 *         in: query
 *         description: 문서 타입을 입력합니다.
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Blog, OFFICIAL]
 *       - name: fields
 *         in: query
 *         description: 필드를 입력해주세요. (카테고리)
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [NEXTJS, MODERNJS, API, WEB, CAREER]
 *       - name: approvalStatus
 *         in: query
 *         description: The approval status of the challenge
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *       - name: keyword
 *         in: query
 *         description: Keyword to search in the title or description
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 챌린지 리스트를 출력합니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: 챌린지 ID
 *                       field:
 *                         type: string
 *                         description: 챌린지 분야
 *                       userId:
 *                         type: string
 *                         description: 챌린지를 생성한 사용자 ID
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                       originURL:
 *                         type: string
 *                         description: 원본 문서 URL
 *                       documentType:
 *                         type: string
 *                         description: 문서 타입
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                         description: 챌린지 마감일
 *                       maxParticipants:
 *                         type: integer
 *                         description: 최대 참가자 수
 *                       currentParticipants:
 *                         type: integer
 *                         description: 현재 참가자 수
 *                       description:
 *                         type: string
 *                         description: 챌린지 설명
 *                       content:
 *                         type: string
 *                         description: 챌린지 내용
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: 삭제된 날짜
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 생성된 날짜
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 마지막 업데이트 날짜
 *                       deletedReason:
 *                         type: string
 *                         nullable: true
 *                         description: 삭제 사유
 *                       rejectedReason:
 *                         type: string
 *                         nullable: true
 *                         description: 거절 사유
 *                       approvalStatus:
 *                         type: string
 *                         description: 승인 상태
 *                 totalCount:
 *                   type: integer
 *                   description: 총 챌린지 개수
 *             example:
 *               challenges:
 *                 - id: "0896ee06-e338-41e4-b006-d7c3fe726bf0"
 *                   field: "CAREER"
 *                   userId: "user-13"
 *                   title: "포트폴리오 작성 팁 문서 번역"
 *                   originURL: "https://example.com/docs/more-12"
 *                   documentType: "BLOG"
 *                   deadline: "2025-04-10T00:00:00.000Z"
 *                   maxParticipants: 6
 *                   currentParticipants: 1
 *                   description: "포트폴리오 작성 팁 문서 번역에 대한 협업 번역 챌린지입니다."
 *                   content: "포트폴리오 작성 팁 문서 번역 내용을 자연스럽게 번역하고 예시도 충실히 반영해주세요."
 *                   deletedAt: null
 *                   createdAt: "2025-03-25T00:00:00.000Z"
 *                   updatedAt: "2025-03-27T05:07:10.943Z"
 *                   deletedReason: null
 *                   rejectedReason: null
 *                   approvalStatus: "PENDING"
 *                 - id: "223b2a33-21d1-4f81-aa07-8b7b0beb7401"
 *                   field: "NEXTJS"
 *                   userId: "user-11"
 *                   title: "테크니컬 라이팅 가이드 번역"
 *                   originURL: "https://example.com/docs/more-2"
 *                   documentType: "OFFICIAL"
 *                   deadline: "2025-04-03T00:00:00.000Z"
 *                   maxParticipants: 4
 *                   currentParticipants: 3
 *                   description: "테크니컬 라이팅 가이드 번역에 대한 협업 번역 챌린지입니다."
 *                   content: "테크니컬 라이팅 가이드 번역 내용을 자연스럽게 번역하고 예시도 충실히 반영해주세요."
 *                   deletedAt: null
 *                   createdAt: "2025-03-24T00:00:00.000Z"
 *                   updatedAt: "2025-03-27T05:07:10.943Z"
 *                   deletedReason: null
 *                   rejectedReason: null
 *                   approvalStatus: "REJECTED"
 *               totalCount: 19
 *       400:
 *         description: 사용자 입력 오류
 *       500:
 *         description: 서버 오류
 */

// const getChallenges: Controller = async (req, res, next) => {
//   try {
//     const {
//       documentType,
//       fields,
//       approvalStatus,
//       keyword,
//       page = '1',
//       limit = '10',
//     } = req.query;
//     // 쿼리 구조분해 된 것들 각각 검증 필요
//     if (
//       documentType &&
//       !isValidEnumValue(DocumentType, documentType.toString())
//     ) {
//       next({ statusCode: 400 });
//       return;
//     }

//     if (
//       approvalStatus &&
//       !isValidEnumValue(ApprovalStatus, approvalStatus.toString())
//     ) {
//       next({ statusCode: 400 });
//       return;
//     }

//     // fields 검증 (배열 형식이나 단일 값 검증)
//     if (fields && !Array.isArray(fields)) {
//       if (!isValidEnumValue(FieldType, fields.toString())) {
//         return next({ statusCode: 400 });
//       }
//     } else if (Array.isArray(fields)) {
//       for (const field of fields) {
//         if (!isValidEnumValue(FieldType, field.toString())) {
//           return next({ statusCode: 400 });
//         }
//       }
//     }

//     const pageNumber = Number(page);
//     const limitNumber = Number(limit);

//     if (isNaN(pageNumber) || isNaN(limitNumber)) {
//       next({ statusCode: 400 });
//       return;
//     }

//     const result = await ChallengesService.getChallenges({
//       documentType: documentType as DocumentType,
//       fields: fields as FieldType | FieldType[],
//       approvalStatus: approvalStatus as ApprovalStatus,
//       keyword: keyword as string,
//       page: pageNumber,
//       limit: limitNumber,
//     });
//     res.status(200).send(result);
//   } catch (err) {
//     next(err);
//   }
// };

// const postChallenge: Controller = async (req, res, next) => {
  
// };

const ChallengesController = {
  // getChallenges,
  getChallenge,
  // postChallenge,
};

export default ChallengesController;
