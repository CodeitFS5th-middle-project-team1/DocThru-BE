import prisma from '../../prismaClient';

interface GetTranslationsParams {
  challengeId: string;
  page: number;
  limit: number;
}

const getTranslations = async ({
  challengeId,
  page,
  limit,
}: GetTranslationsParams) => {
  // 챌린지 존재 여부 확인
  const challengeExists = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { id: true },
  });

  if (!challengeExists) {
    throw new Error('Challenge not found');
  }
  const [translations, totalCount] = await Promise.all([
    prisma.translation.findMany({
      where: {
        challengeId,
        deletedAt: null,
      },
      orderBy: {
        likeCount: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
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
