import { FieldType, Prisma } from '@prisma/client';
import prisma from '../../prismaClient';
import {
  CreateChallengeArgs,
  GetChallengeListByUserArgs,
  GetChallengeListParticipating,
  GetChallengeResponse,
  Order,
  UpdateChallengeArgs,
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
        id: true,
        title: true,
        field: true,
        maxParticipants: true,
        currentParticipants: true,
        deadline: true,
        documentType: true,
        isParticipantsFull: true,
        isDeadlineFull: true,
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

  return { challenges, totalCount };
};


const getChallengeListParticipating = async ({
  documentType,
  fields,
  keyword,
  page,
  limit,
  userId,
  onlySuccess,
}: GetChallengeListParticipating) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const successBoolean = onlySuccess === "true";

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
        isDeadlineFull: successBoolean,
        userId,
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        field: true,
        maxParticipants: true,
        currentParticipants: true,
        deadline: true,
        documentType: true,
        isParticipantsFull: true,
        isDeadlineFull: true,
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
        ...({ isDeadlineFull: successBoolean }),
        userId,
      },
    }),
  ]);

  return { challenges, totalCount };

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
        orderCondition.approvalAt = 'desc'; // 승인 최신 순
        break;
      case Order.applyLast:
        orderCondition.approvalAt = 'asc'; // 승인 오래된 순
        break;
      case Order.deadLineFirst:
        orderCondition.deadline = 'desc'; // 마감일 최신 순
        break;
      case Order.deadLineLast:
        orderCondition.deadline = 'asc'; // 마감일 오래된 순
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
        id: true,
        idx: true,
        title: true,
        field: true,
        maxParticipants: true,
        deadline: true,
        createdAt: true,
        documentType: true,
        approvalStatus: true,
        isParticipantsFull: true,
        isDeadlineFull: true,
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


const getChallengeListByUser = async ({
  orderBy,
  page,
  limit,
  approvalStatus,
  keyword,
  userId,
}: GetChallengeListByUserArgs) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const skip = (pageNum - 1) * limitNum;

  const order = (() => {
    const orderCondition: Prisma.ChallengeOrderByWithRelationInput = {
    };

    switch (orderBy) {
      case Order.applyFirst:
        orderCondition.approvalAt = 'desc'; // 승인 최신 순
        break;
      case Order.applyLast:
        orderCondition.approvalAt = 'asc'; // 승인 오래된 순
        break;
      case Order.deadLineFirst:
        orderCondition.deadline = 'desc'; // 마감일 최신 순
        break;
      case Order.deadLineLast:
        orderCondition.deadline = 'asc'; // 마감일 오래된 순
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
        userId,
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
        id: true,
        idx: true,
        title: true,
        field: true,
        maxParticipants: true,
        deadline: true,
        createdAt: true,
        documentType: true,
        approvalStatus: true,
        isParticipantsFull: true,
        isDeadlineFull: true,
      },
    }),
    prisma.challenge.count({
      where: {
        userId,
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
  userId,
}: CreateChallengeArgs) => {
  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
      userId,
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
}: UpdateChallengeArgs) => {
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

const deleteChallengeForce = async (id: string, deletedReason:string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      deletedReason,
      approvalStatus: "DELETED",
    }
  });
  return { challenge };
};

const deleteChallenge = async (id: string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      approvalStatus: "DELETED",
    }
  });
  return { challenge };
};

const ChallengesService = {
  getChallengeList,
  getChallengeListByUser,
  getChallengeListByAdmin,
  getChallengeListParticipating,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallengeForce,
  deleteChallenge,
};

export default ChallengesService;
