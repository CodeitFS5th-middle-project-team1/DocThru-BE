import prisma from '../../prismaClient';

const getTranslations = async (
  challengeId: string,
  page: number = 1,
  pageSize: number = 5
) => {
  const [translations, totalCount] = await Promise.all([
    prisma.translation.findMany({
      where: {
        challengeId,
        deletedAt: null,
      },
      orderBy: {
        likeCount: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.translation.count({
      where: {
        challengeId,
        deletedAt: null,
      },
    }),
  ]);

  return { translations, totalCount };
};

const TranslationsService = {
  getTranslations,
};

export default TranslationsService;
