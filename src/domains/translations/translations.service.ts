import prisma from '../../prismaClient';
import {
  TranslationListResponse,
  CreateTranslationRequest,
  CreateTranslationResponse,
} from './translations.types';

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
// 챌린지 존재 여부 확인 유틸리티 함수
const checkChallengeExists = async (challengeId: string) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { id: true },
  });

  if (!challenge) {
    throw new NotFoundError(`ChallengeId ${challengeId} not found`);
  }

  return challenge;
};
// 사용자 존재 여부 확인 유틸리티 함수
const checkUserExists = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found`);
  }

  return user;
};
const getTranslations = async ({
  challengeId,
  page,
  limit,
}: {
  challengeId: string;
  page: number;
  limit: number;
}): Promise<TranslationListResponse> => {
  // 챌린지 존재 여부 확인
  await checkChallengeExists(challengeId);

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
    })),
  };
};

// 번역물 생성 함수
const createTranslation = async (
  data: CreateTranslationRequest
): Promise<CreateTranslationResponse> => {
  const { title, content, userId, challengeId } = data;

  // 챌린지와 사용자 존재 여부 확인
  await Promise.all([
    checkChallengeExists(challengeId),
    checkUserExists(userId),
  ]);

  // 번역물 생성
  const translation = await prisma.translation.create({
    data: {
      createdAt: new Date(),
      title,
      content,
      userId,
      challengeId,
      likeCount: 0,
    },
  });

  return {
    id: translation.id,
    title: translation.title,
    content: translation.content,
    userId: translation.userId,
    challengeId: translation.challengeId,
    likeCount: translation.likeCount,
    createdAt: translation.createdAt,
  };
};

const TranslationsService = {
  getTranslations,
  createTranslation,
};

export default TranslationsService;
