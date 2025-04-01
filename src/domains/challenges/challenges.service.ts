import { FieldType, Prisma } from '@prisma/client';
import prisma from '../../prismaClient';
import {
  GetChallengeResponse,
  Order,
  UpdateChallengeRequest,
} from './challenges.type';
import {
  ChallengeRequestBody,
  ChallengeRequestQueries,
} from './challenges.validation';

const getChallenge = async (id: string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id,
    },
  });
  return { challenge };
};

const getChallengeList = async ({
  documentType,
  fields,
  keyword,
  page,
  limit,
}: ChallengeRequestQueries) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const skip = (pageNum - 1) * limitNum;
  const fieldCondition =
    Array.isArray(fields) && fields.length > 0
      ? { in: fields as FieldType[] }
      : fields
      ? { equals: fields as FieldType }
      : undefined;

  const [challenges, totalCount] = await Promise.all([
    prisma.challenge.findMany({
      where: {
        documentType: documentType || undefined,
        field: fieldCondition || undefined,
        approvalStatus: 'APPROVED',
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        field: true,
        maxParticipants: true,
        currentParticipants: true,
        deadline: true,
        documentType: true,
      },
    }),
    prisma.challenge.count({
      where: {
        documentType: documentType || undefined,
        field: fieldCondition || undefined,
        approvalStatus: 'APPROVED',
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
    }),
  ]);

  const challengesWithIsMax = challenges.map((challenge) => {
    if (challenge.maxParticipants === challenge.currentParticipants) {
      return { ...challenge, isMax: true };
    } else return { ...challenge, isMax: false };
  });

  return { challengesWithIsMax, totalCount };
};

const getChallengeListByAdmin = async ({
  orderBy,
  page,
  limit,
  approvalStatus,
  keyword,
}: ChallengeRequestQueries) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const skip = (pageNum - 1) * limitNum;

  const order = (() => {
    const orderCondition: Prisma.ChallengeOrderByWithRelationInput = {
    };

    switch (orderBy) {
      case Order.applyFirst:
        orderCondition.approvalAt = 'desc'; // 추가 조건
        break;
      case Order.applyLast:
        orderCondition.approvalAt = 'asc'; // 추가 조건
        break;
      case Order.deadLineFirst:
        orderCondition.deadline = 'desc'; // 추가 조건
        break;
      case Order.deadLineLast:
        orderCondition.deadline = 'asc'; // 추가 조건
        break;
      default:
        // 기본값 (idx: 'desc')이 이미 설정되어 있음
        orderCondition.idx = 'desc';
        break;
    }

    return orderCondition;
  })();

  const [challenges, totalCount] = await Promise.all([
    prisma.challenge.findMany({
      where: {
        approvalStatus: approvalStatus || undefined,
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
      skip,
      take: limitNum,
      orderBy: order,
      select: {
        idx: true,
        title: true,
        field: true,
        maxParticipants: true,
        deadline: true,
        createdAt: true,
        documentType: true,
        approvalStatus: true,
      },
    }),
    prisma.challenge.count({
      where: {
        approvalStatus: approvalStatus || undefined,
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
    }),
  ]);

  return { challenges, totalCount };
};

const createChallenge = async ({
  title,
  description,
  documentType,
  field,
  maxParticipants,
  deadline,
  originURL,
}: ChallengeRequestBody) => {
  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
      userId: 'user-1',
    },
  });

  return challenge;
};

const updateChallenge = async ({
  id,
  title,
  description,
  documentType,
  field,
  maxParticipants,
  deadline,
  originURL,
}: UpdateChallengeRequest) => {
  const challenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
    },
  });

  return challenge;
};

const deleteChallenge = async (id: string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.delete({
    where: {
      id,
    },
  });
  return { challenge };
};

const ChallengesService = {
  getChallengeList,
  getChallengeListByAdmin,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};

export default ChallengesService;
