import { FieldType } from '@prisma/client';
import prisma from '../../prismaClient';
import { GetChallengeResponse, UpdateChallengeRequest } from './challenges.type';
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
  approvalStatus,
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
        approvalStatus,
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
      skip,
      take: limitNum,
      orderBy: { createdAt : "desc" },
    }),
    prisma.challenge.count({
      where: {
        documentType: documentType || undefined,
        field: fieldCondition || undefined,
        approvalStatus,
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
  originURL
}: ChallengeRequestBody
) => {
  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
      userId:"user-1",
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
  originURL
} : UpdateChallengeRequest
) => {
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
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
};

export default ChallengesService;
