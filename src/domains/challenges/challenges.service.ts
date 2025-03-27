import { FieldType } from '@prisma/client';
import prisma from '../../prismaClient';
import { GetChallengesParams } from '../../types/challenges';

const getChallenge = async (id : string) => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id,
    }
  })
  return { challenge };
}

const getChallenges = async ({
  documentType,
  fields,
  approvalStatus,
  keyword,
  page,
  limit,
}: GetChallengesParams) => {
  const skip = (page - 1) * limit;
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
      take: limit,
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
  getChallenges,
  getChallenge,
};

export default ChallengesService;
