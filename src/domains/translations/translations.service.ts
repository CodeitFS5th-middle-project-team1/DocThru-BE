import prisma from '../../prismaClient';

// export const getAllTranslations = async () => {
//   console.log('🔥 getAllTranslations called');

//   return await prisma.translation.findMany({
//     where: {
//       deletedAt: null,
//     },
//     orderBy: {
//       likeCount: 'desc',
//     },
//   });
// };
const getTranslations = async (challengeId: string) => {
  return await prisma.translation.findMany({
    where: {
      challengeId,
      deletedAt: null,
    },
    orderBy: {
      likeCount: 'desc',
    },
  });
};

// ✅ 객체로 묶어서 export
const TranslationsService = {
  getTranslations,
};

export default TranslationsService;
