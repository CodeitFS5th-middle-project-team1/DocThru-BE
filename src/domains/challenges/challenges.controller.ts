import ChallengesService from './challenges.service';
import { isValidEnumValue } from '../../utils/isValidEnumValue';
import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import {
  DeleteController,
  GetController,
  PatchController,
  PostController,
} from '../../types/express';
import {
  GetChallengeListResponse,
  GetChallengeResponse,
  UpdateChallengeResponse,
  PostChallengeResponse,
  DeleteChallengeResponse,
  GetChallengeListByAdminResponse,
} from './challenges.type';
import {
  ChallengeRequestBody,
  ChallengeRequestParams,
  ChallengeRequestQueries,
} from './challenges.validation';

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
 *                 user: {nickname: "test"}
 *       404:
 *         description: 요청한 리소스를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */
const getChallenge: GetController<
  ChallengeRequestParams,
  never,
  GetChallengeResponse
> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
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
 * /api/challenges/manage:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: 관리자용 챌린지 목록 조회
 *     description: 관리자가 승인 상태, 키워드, 정렬 기준 등을 기반으로 챌린지 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [applyFirst, applyLast, deadLineFirst, deadLineLast] # Replace with actual sortable fields
 *         description: 챌린지 정렬 기준
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED] # Replace with actual approval status values
 *         description: 승인 상태로 필터링
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명에서 키워드 검색
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 성공적으로 챌린지 목록 반환
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
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                       approvalStatus:
 *                         type: string
 *                         description: 승인 상태
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 생성 날짜
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 마지막 업데이트 날짜
 *                 totalCount:
 *                   type: integer
 *                   description: 총 챌린지 수
 *       403:
 *         description: 권한 없음
 *       500:
 *         description: 서버 오류
 */
const getChallengeListByAdmin: GetController<
  never,
  ChallengeRequestQueries,
  GetChallengeListByAdminResponse
> = async (req, res, next) => {
  try {
    const authRole = req.user?.role;
    if (authRole !== 'ADMIN') {
      next({ status: 403 });
      return;
    }

    const {
      orderBy,
      page = '1',
      limit = '10',
      approvalStatus,
      keyword,
    } = req.query;
    const result = await ChallengesService.getChallengeListByAdmin({
      orderBy,
      page,
      limit,
      approvalStatus,
      keyword,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges/user:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: 사용자별 챌린지 목록 조회
 *     description: 사용자가 생성한 챌린지 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [applyFirst, applyLast, deadLineFirst, deadLineLast]
 *         description: 챌린지 정렬 기준
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: 승인 상태로 필터링
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명에서 키워드 검색
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 성공적으로 사용자별 챌린지 목록 반환
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
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                       approvalStatus:
 *                         type: string
 *                         description: 승인 상태
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 생성 날짜
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 마지막 업데이트 날짜
 *                 totalCount:
 *                   type: integer
 *                   description: 총 챌린지 수
 *             example:
 *               challenges:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   title: "프론트엔드 번역 챌린지"
 *                   approvalStatus: "APPROVED"
 *                   createdAt: "2025-03-29T12:00:00.000Z"
 *                   updatedAt: "2025-03-30T12:00:00.000Z"
 *                 - id: "789e4567-e89b-12d3-a456-426614174001"
 *                   title: "백엔드 번역 챌린지"
 *                   approvalStatus: "PENDING"
 *                   createdAt: "2025-03-28T12:00:00.000Z"
 *                   updatedAt: "2025-03-29T12:00:00.000Z"
 *               totalCount: 2
 *       403:
 *         description: 사용자 인증 실패
 *       500:
 *         description: 서버 오류
 */
const getChallengeListByUser: GetController<
  never,
  ChallengeRequestQueries,
  GetChallengeListByAdminResponse
> = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const {
      orderBy,
      page = '1',
      limit = '10',
      approvalStatus,
      keyword,
    } = req.query;
    const result = await ChallengesService.getChallengeListByUser({
      orderBy,
      page,
      limit,
      approvalStatus,
      keyword,
      userId: userId as string,
    });
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
 *     description: 필터 및 정렬 조건을 기반으로 챌린지 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [BLOG, OFFICIAL]
 *         description: 문서 타입으로 필터링
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           enum: [NEXTJS, MODERNJS, API, WEB, CAREER]
 *         description: 챌린지 분야로 필터링
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명에서 키워드 검색
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *     responses:
 *       200:
 *         description: 성공적으로 챌린지 목록 반환
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
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                       documentType:
 *                         type: string
 *                         description: 문서 타입
 *                       field:
 *                         type: string
 *                         description: 챌린지 분야
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 생성 날짜
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 마지막 업데이트 날짜
 *                 totalCount:
 *                   type: integer
 *                   description: 총 챌린지 수
 *             example:
 *               challenges:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   title: "프론트엔드 번역 챌린지"
 *                   documentType: "BLOG"
 *                   field: "NEXTJS"
 *                   createdAt: "2025-03-29T12:00:00.000Z"
 *                   updatedAt: "2025-03-30T12:00:00.000Z"
 *                 - id: "789e4567-e89b-12d3-a456-426614174001"
 *                   title: "백엔드 번역 챌린지"
 *                   documentType: "OFFICIAL"
 *                   field: "API"
 *                   createdAt: "2025-03-28T12:00:00.000Z"
 *                   updatedAt: "2025-03-29T12:00:00.000Z"
 *               totalCount: 2
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 */

const getChallengeList: GetController<
  never,
  ChallengeRequestQueries,
  GetChallengeListResponse
> = async (req, res, next) => {
  try {
    const {
      documentType,
      fields,
      keyword,
      page = '1',
      limit = '10',
    } = req.query;

    const result = await ChallengesService.getChallengeList({
      documentType,
      fields,
      keyword,
      page,
      limit,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
/**
 * @swagger
 * /api/challenges/participating:
 *   get:
 *     tags:
 *       - Challenges
 *     summary: 참여중 챌린지 목록 조회
 *     description: 필터 및 정렬 조건을 기반으로 참여중인 챌린지 목록을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [BLOG, OFFICIAL]
 *         description: 문서 타입으로 필터링
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *           enum: [NEXTJS, MODERNJS, API, WEB, CAREER]
 *         description: 챌린지 분야로 필터링
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 또는 설명에서 키워드 검색
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: isExpired
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: 성공한 챌린지만 필터링 여부 // true일 때 마감된 챌린지, false일 때 참여중 챌린지
 *     responses:
 *       200:
 *         description: 성공적으로 챌린지 목록 반환
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
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                       documentType:
 *                         type: string
 *                         description: 문서 타입
 *                       field:
 *                         type: string
 *                         description: 챌린지 분야
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: 생성 날짜
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: 마지막 업데이트 날짜
 *                 totalCount:
 *                   type: integer
 *                   description: 총 챌린지 수
 *             example:
 *               challenges:
 *                 - id: "123e4567-e89b-12d3-a456-426614174000"
 *                   title: "프론트엔드 번역 챌린지"
 *                   documentType: "BLOG"
 *                   field: "NEXTJS"
 *                   createdAt: "2025-03-29T12:00:00.000Z"
 *                   updatedAt: "2025-03-30T12:00:00.000Z"
 *                 - id: "789e4567-e89b-12d3-a456-426614174001"
 *                   title: "백엔드 번역 챌린지"
 *                   documentType: "OFFICIAL"
 *                   field: "API"
 *                   createdAt: "2025-03-28T12:00:00.000Z"
 *                   updatedAt: "2025-03-29T12:00:00.000Z"
 *               totalCount: 2
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 */

const getChallengeListParticipating: GetController<
  never,
  ChallengeRequestQueries,
  GetChallengeListResponse
> = async (req, res, next) => {
  try {
    const {
      keyword,
      page = '1',
      limit = '10',
      isExpired = "false",
    } = req.query;
    const userId = req.user?.id;
    const result = await ChallengesService.getChallengeListParticipating({
      keyword,
      page,
      limit,
      userId: userId as string,
      isExpired,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges:
 *   post:
 *     tags:
 *       - Challenges
 *     summary: 챌린지 생성
 *     description: 새로운 챌린지를 생성합니다.
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
 *                 example: "프론트엔드 번역 챌린지"
 *               description:
 *                 type: string
 *                 description: 챌린지 설명
 *                 example: "프론트엔드 관련 문서를 번역하는 챌린지입니다."
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
 *                 example: 10
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 챌린지 마감일
 *                 example: "2025-04-01T00:00:00.000Z"
 *               originURL:
 *                 type: string
 *                 format: url
 *                 description: 원본 문서 URL
 *                 example: "https://example.com/original-doc"
 *     responses:
 *       200:
 *         description: 챌린지가 성공적으로 생성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: 생성된 챌린지 ID
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 title:
 *                   type: string
 *                   description: 챌린지 제목
 *                   example: "프론트엔드 번역 챌린지"
 *                 description:
 *                   type: string
 *                   description: 챌린지 설명
 *                   example: "프론트엔드 관련 문서를 번역하는 챌린지입니다."
 *                 documentType:
 *                   type: string
 *                   description: 문서 타입
 *                   example: "BLOG"
 *                 field:
 *                   type: string
 *                   description: 챌린지 분야
 *                   example: "NEXTJS"
 *                 maxParticipants:
 *                   type: integer
 *                   description: 최대 참가자 수
 *                   example: 10
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                   description: 챌린지 마감일
 *                   example: "2025-04-01T00:00:00.000Z"
 *                 originURL:
 *                   type: string
 *                   format: url
 *                   description: 원본 문서 URL
 *                   example: "https://example.com/original-doc"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: 생성된 날짜
 *                   example: "2025-03-29T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: 마지막 업데이트 날짜
 *                   example: "2025-03-29T12:00:00.000Z"
 *       400:
 *         description: 잘못된 요청 데이터
 *       500:
 *         description: 서버 오류
 */
const postChallenge: PostController<
  never,
  ChallengeRequestBody,
  PostChallengeResponse
> = async (req, res, next) => {
  try {
    const {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
    } = req.body;
    const userId = req.user?.id;
    if (new Date(deadline) <= new Date()) {
      next({status:400, message: "마감일자는 현재 날짜 이후부터 가능합니다."});
      return;
    }
    const result = await ChallengesService.createChallenge({
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
      userId: userId as string,
    });
    res.status(200).send({ challenge: result, code: 200 });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/challenges/{challengeId}:
 *   patch:
 *     tags:
 *       - Challenges
 *     summary: 챌린지 수정
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
const patchChallenge: PatchController<
  ChallengeRequestParams,
  ChallengeRequestBody,
  UpdateChallengeResponse
> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    const existChallenge = await ChallengesService.getChallenge(id);
    const isEqualUser = req.user?.id === existChallenge.challenge?.userId;
    const authRole = req.user?.role;
    if (!existChallenge.challenge) {
      next({ status: 404 });
      return;
    }
    if ((authRole !== 'ADMIN' && !isEqualUser) || (isEqualUser && existChallenge.challenge.approvalStatus !== "PENDING")) {
      next({ status: 403 });
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
    const result = await ChallengesService.updateChallenge({
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

/**
 * @swagger
 * /api/challenges/{challengeId}/removeForce:
 *   patch:
 *     tags:
 *       - Challenges
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
    const result = await ChallengesService.deleteChallengeForce(
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
 * /api/challenges/{challengeId}/remove:
 *   patch:
 *     tags:
 *       - Challenges
 *     summary: 챌린지 삭제
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
const deleteChallenge: DeleteController<
  ChallengeRequestParams,
  never,
  DeleteChallengeResponse
> = async (req, res, next) => {
  try {
    const id = req.params.challengeId;
    const existChallenge = await ChallengesService.getChallenge(id);

    if (!existChallenge.challenge) {
      next({ status: 404 });
      return;
    }

    if (existChallenge.challenge.userId !== req.user?.id || existChallenge.challenge.approvalStatus !== "PENDING") {
      next({ status: 403 });
      return;
    }

    const result = await ChallengesService.deleteChallenge(
      id,
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

const ChallengesController = {
  getChallengeList,
  getChallengeListByUser,
  getChallengeListByAdmin,
  getChallengeListParticipating,
  getChallenge,
  postChallenge,
  patchChallenge,
  deleteChallengeForce,
  deleteChallenge,
};

export default ChallengesController;
