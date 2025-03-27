import prisma from '../../prismaClient';
import { TranslationListResponse } from './translations.types';

interface GetTranslationsParams {
  challengeId: string;
  page: number;
  limit: number;
}

const getTranslations = async ({
  challengeId,
  page,
  limit,
}: GetTranslationsParams): Promise<TranslationListResponse> => {
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

  return {
    totalCount,
    translations: translations.map((translation) => ({
      id: translation.id,
      title: translation.title,
      content: translation.content,
      userId: translation.userId,
      challengeId: translation.challengeId,
      likeCount: translation.likeCount,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
      deletedAt: translation.deletedAt,
    })),
  };
};

const TranslationsService = {
  getTranslations,
};

export default TranslationsService;
