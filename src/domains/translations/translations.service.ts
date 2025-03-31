import { UserRole } from '@prisma/client';
import prisma from '../../prismaClient';
import {
  TranslationListResponse,
  TranslationResponse,
  TranslationRequestBody,
  TranslationRequestParams,
  TranslationRequestListQuery,
} from './translations.types';
import { checkPermission } from '../../utils/checkPermission';
import CustomError from '../../types/error';

// 번역물 목록 조회
const getTranslationList = async ({
  challengeId,
  page,
  limit,
}: TranslationRequestParams &
  TranslationRequestListQuery): Promise<TranslationListResponse> => {
  const pageNum = Number(page || 1);
  const limitNum = Number(limit || 5);

  // skip 계산
  const skipNum = (pageNum - 1) * limitNum;

  const [translations, totalCount] = await Promise.all([
    prisma.translation.findMany({
      where: { challengeId, deletedAt: null },
      orderBy: { likeCount: 'desc' },
      skip: skipNum,
      take: limitNum,
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
}: {
  translationId: string;
  challengeId: string;
  userId?: string;
}): Promise<TranslationResponse & { isLiked?: boolean }> => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id: challengeId,
      deletedAt: null, // 삭제되지 않은 챌린지만 조회
    },
    select: { id: true },
  });

  //TODO: 에러처리 부분을 어떻게 처리할지 고민
  if (!challenge) {
    throw {
      statusCode: 404,
      message: `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`,
    };
  }

  const translation = await prisma.translation.findUnique({
    where: {
      id: translationId,
      challengeId,
      deletedAt: null, // 삭제되지 않은 번역물인지
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });

  //TODO:
  if (!translation) {
    throw {
      statusCode: 404,
      message: `번역물 ID ${translationId}를 찾을 수 없습니다.`,
    };
  }
  //좋아요 여부 확인
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
    } catch (error) {
      throw error;
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
};

/**
 * 번역물을 수정합니다. 작성자 본인 또는 관리자만 수정할 수 있습니다.
 * @param translationId 수정할 번역물 ID
 * @param challengeId 챌린지 ID
 * @param userId 요청한 사용자 ID
 * @param userRole 요청한 사용자의 역할 (권한 확인용)
 * @param updateData 수정할 데이터 (제목, 내용)
 * @returns 수정된 번역물 정보
 */
const updateTranslation = async ({
  translationId,
  challengeId,
  userId,
  userRole,
  updateData,
}: {
  translationId: string;
  challengeId: string;
  userId: string;
  userRole?: UserRole;
  updateData: {
    title?: string;
    content?: string;
  };
}): Promise<TranslationResponse> => {
  try {
    // Challenge의 유효성 검증
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!challenge) {
      throw {
        statusCode: 404,
        message: `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`,
        errorContext: 'challengeLookup',
      };
    }

    // Translation의 유효성 검증 및 권한 확인
    const translation = await prisma.translation.findUnique({
      where: {
        id: translationId,
        challengeId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true, // userId도 조회하여 권한 확인에 사용
            nickname: true,
          },
        },
      },
    });

    if (!translation) {
      throw {
        statusCode: 404,
        message: `번역물 ID ${translationId}를 찾을 수 없습니다.`,
        errorContext: 'translationLookup',
      };
    }

    // 권한 확인 함수사용 - 작성자 본인 또는 관리자만 수정 가능
    if (!checkPermission(translation.user, userId, userRole)) {
      throw new CustomError(
        403,
        '작성자 본인 또는 관리자만 수정할 수 있습니다.'
      );
    }

    // 데이터 업데이트
    const updatedTranslation = await prisma.translation.update({
      where: { id: translationId },
      data: {
        title: updateData.title ?? translation.title,
        content: updateData.content ?? translation.content,
        updatedAt: new Date(),
      },
      include: {
        user: { select: { nickname: true } },
      },
    });

    return {
      id: updatedTranslation.id,
      title: updatedTranslation.title,
      content: updatedTranslation.content,
      userId: updatedTranslation.userId,
      userNickname: updatedTranslation.user?.nickname,
      challengeId: updatedTranslation.challengeId,
      likeCount: updatedTranslation.likeCount,
      createdAt: updatedTranslation.createdAt,
      updatedAt: updatedTranslation.updatedAt,
    };
  } catch (error) {
    // console.error('번역물 수정 중 오류 발생:', {
    //   challengeId,
    //   translationId,
    //   error,
    // });

    if (error.statusCode) {
      throw error;
    }

    throw {
      statusCode: 500,
      message: '서버 내부 오류가 발생했습니다.',
    };
  }
};

export const TranslationsService = {
  getTranslationList,
  postTranslation,
  getTranslationById,
  updateTranslation,
};
