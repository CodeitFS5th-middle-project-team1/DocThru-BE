import prisma from '../../prismaClient';
import {
  TranslationListResponse,
  CreateTranslationRequest,
  CreateTranslationResponse,
  UpdateTranslationRequest,
  UpdateTranslationResponse,
} from './translations.types';
import { NotFoundError } from '../../utils/checkUserPermission';

// 챌린지 존재 여부 확인 유틸리티 함수
const checkChallengeExists = async (challengeId: string) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { id: true },
  });

  if (!challenge) {
    throw new NotFoundError(`챌린지 ID ${challengeId}를 찾을 수 없습니다.`);
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

const updateTranslation = async (
  translationId: string,
  userId: string,
  challengeId: string,
  data: UpdateTranslationRequest
): Promise<UpdateTranslationResponse> => {
  // 수정할 데이터가 없는 경우 검증
  if (!data.title && !data.content) {
    throw new Error('No data provided for update');
  }

  // 우선 챌린지 존재 여부 확인
  await checkChallengeExists(challengeId);

  // 사용자 정보 조회 (역할 확인을 위해)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true, // 관리자 여부 확인
    },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found`);
  }

  const isAdmin = user.role === 'ADMIN';

  //번역물 존재 여부 확인
  const existingTranslation = await prisma.translation.findUnique({
    where: { id: translationId },
    select: {
      id: true,
      userId: true,
      challengeId: true,
      deletedAt: true,
    },
  });

  if (!existingTranslation) {
    throw new NotFoundError(
      `번역물을 찾을 수 없습니다. 번역물 ID: ${translationId}`
    );
  }

  //  삭제된 번역물인지 확인
  if (existingTranslation.deletedAt) {
    throw new NotFoundError(`삭제된 번역물입니다. 번역물 ID: ${translationId}`);
  }

  // 번역물이 요청된 챌린지에 속하는지 확인
  if (existingTranslation.challengeId !== challengeId) {
    throw new Error(
      `챌린지 ID ${challengeId}와 번역물 ID ${translationId}가 일치하지 않습니다.`
    );
  }

  //  소유권 검증 - 본인의 번역물이거나 관리자인 경우에만 수정 가능
  if (existingTranslation.userId !== userId && !isAdmin) {
    throw new Error('권한 없음');
  }

  //  번역물 업데이트
  const updatedTranslation = await prisma.translation.update({
    where: { id: translationId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
    },
  });

  return {
    id: updatedTranslation.id,
    title: updatedTranslation.title,
    content: updatedTranslation.content,
    userId: updatedTranslation.userId,
    challengeId: updatedTranslation.challengeId,
    likeCount: updatedTranslation.likeCount,
    //createdAt: updatedTranslation.createdAt,
    updatedAt: updatedTranslation.updatedAt,
  };
};

const TranslationsService = {
  getTranslations,
  createTranslation,
  updateTranslation,
};

export default TranslationsService;
