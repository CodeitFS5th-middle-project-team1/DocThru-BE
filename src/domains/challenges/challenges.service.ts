import { FieldType } from '@prisma/client';
import prisma from '../../prismaClient';
import { GetChallengeListQuery, GetChallengeResponse } from './challenges.type';

const getChallenge = async (id : string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id,
    }
  })
  return {challenge};
}

const getChallengeList = async ({
  documentType,
  fields,
  approvalStatus,
  keyword,
  page,
  limit,
}: GetChallengeListQuery) => {
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


const ChallengesService = {
  getChallengeList,
  getChallenge,
  // postChallenge,
};

export default ChallengesService;
