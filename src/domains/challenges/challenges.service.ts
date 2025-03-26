import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import prisma from '../../prismaClient';

const getChallenges = async (
  documentType: DocumentType | undefined,
  fields: FieldType | FieldType[],
  approvalStatus: ApprovalStatus,
  keyword: string | undefined,
  page: number,
  limit: number
) => {

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
    })
  ])
  

  return {challenges, totalCount};
};

const ChallengesService = {
  getChallenges,
};

export default ChallengesService;
