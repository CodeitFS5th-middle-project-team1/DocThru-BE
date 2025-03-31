import prisma from '../../prismaClient';
import {
  TranslationListResponse,
  TranslationResponse,
  TranslationRequestBody,
  TranslationRequestParams,
  TranslationRequestListQuery,
  TranslationParamsWithId,
} from './translations.types';
import errorHandler from '../../middleware/errorHandler';
// 번역물 목록 조회
const getTranslationList = async ({
  challengeId,
  page,
  limit,
}: TranslationRequestParams &
  TranslationRequestListQuery): Promise<TranslationListResponse> => {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const [translations, totalCount] = await Promise.all([
    prisma.translation.findMany({
      where: { challengeId, deletedAt: null },
      orderBy: { likeCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { nickname: true } } },
    }),
    prisma.translation.count({
      where: { challengeId, deletedAt: null },
    }),
  ]);

  return {
    totalCount,
    translations: translations.map(({ user, ...translation }) => ({
      ...translation,
      userNickname: user?.nickname,
    })),
  };
};
/**
 * 번역물을 생성합니다.
 * @param title 번역물 제목
 * @param content 번역물 내용
 * @param userId 사용자 ID
 * @param challengeId 챌린지 ID
 * @returns 생성된 번역물 정보
 */
const postTranslation = async ({
  title,
  content,
  userId,
  challengeId,
}: TranslationRequestBody & {
  userId: string;
  challengeId: string;
}): Promise<TranslationResponse> => {
  // try {
  //   // 챌린지 존재 여부 확인 (선택적)
  //   const challenge = await prisma.challenge.findUnique({
  //     where: {
  //       id: challengeId,
  //       deletedAt: null,
  //     },
  //     select: { id: true },
  //   });

  //   if (!challenge) {
  //     throw {
  //       statusCode: 404,
  //       message: `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`,
  //     };
  //   }

  const translation = await prisma.translation.create({
    data: {
      title,
      content,
      userId,
      challengeId,
      likeCount: 0,
    },
    include: {
      user: {
        select: { nickname: true },
      },
    },
  });

  return {
    id: translation.id,
    title: translation.title,
    content: translation.content,
    userId: translation.userId,
    challengeId: translation.challengeId,
    likeCount: translation.likeCount,
    userNickname: translation.user?.nickname, // 사용자 닉네임 추가 (있는 경우)
    createdAt: translation.createdAt,
    updatedAt: translation.updatedAt,
  };
};

/**
 * 번역물 상세 정보를 조회합니다.
 * @param translationId 번역물 ID
 * @param challengeId 챌린지 ID
 * @param userId 사용자 ID (선택적, 좋아요 여부 확인용)
 * @returns 번역물 상세 정보
 */
const getTranslationById = async ({
  translationId,
  challengeId,
  userId,
}: TranslationParamsWithId & { userId?: string }): Promise<
  TranslationResponse & { isLiked?: boolean }
> => {
  try {
    // 챌린지 존재 여부 확인
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null, // 삭제되지 않은 챌린지만 조회
      },
      select: { id: true },
    });
    // 챌린지 ID가 유효한지 확인 (선택적)
    // if (!challenge) {
    //   throw {
    //     statusCode: 404,
    //     message: `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`,
    //   };
    // }

    // 번역물 조회
    const translation = await prisma.translation.findFirst({
      where: {
        id: translationId,
        challengeId,
        deletedAt: null, // 삭제되지 않은 번역물만 조회
      },
      include: {
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });

    //번역물 존재 여부 확인
    if (!translation) {
      throw {
        statusCode: 404,
        message: `번역물 ID ${translationId}를 찾을 수 없거나 이미 삭제되었습니다.`,
      };
    }

    // 사용자의 좋아요 여부 isLiked 확인
    let isLiked = false;
    if (userId) {
      try {
        const like = await prisma.like.findFirst({
          where: {
            userId,
            translationId,
          },
          select: { id: true },
        });
        isLiked = !!like;
      } catch (likeError) {
        console.error('좋아요 상태 확인 중 오류 발생:', likeError);
        // isLiked는 기본값 false
      }
    }

    return {
      id: translation.id,
      title: translation.title,
      content: translation.content,
      userId: translation.userId,
      userNickname: translation.user?.nickname,
      challengeId: translation.challengeId,
      likeCount: translation.likeCount,
      isLiked,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getTranslationList,
  postTranslation,
  getTranslationById,
};
