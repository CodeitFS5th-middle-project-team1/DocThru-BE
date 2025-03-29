import prisma from '../../prismaClient';
import {
  TranslationListResponse,
  PostTranslationResponse,
} from './translations.types';

/**
 * 번역물 목록을 조회합니다.
 * @param challengeId 챌린지 ID
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 5)
 * @returns 번역물 목록과 총 개수
 */
// 번역물 목록 조회
const getTranslationList = async ({
  challengeId,
  page,
  limit,
}: {
  challengeId: string;
  page: number;
  limit: number;
}): Promise<TranslationListResponse> => {
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
    translations: translations.map((translation) => {
      const { user, ...rest } = translation;
      return {
        ...rest,
        userNickname: user?.nickname,
      };
    }),
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
}: {
  title: string;
  content: string;
  userId: string;
  challengeId: string;
}): Promise<PostTranslationResponse> => {
  const translation = await prisma.translation.create({
    data: {
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
}): Promise<PostTranslationResponse & { isLiked?: boolean }> => {
  // 먼저 챌린지 존재 여부 확인 (cascade delete 여부 확인)
  //TODO: 이부분도 zod로 검증해야하는지?
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

  // 챌린지가 존재하면 번역물 조회
  const translation = await prisma.translation.findUnique({
    where: {
      id: translationId,
      challengeId, // 해당 챌린지에 속한 번역물인지
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

  // 응답 형식에 맞게 데이터 반환
  return {
    id: translation.id,
    title: translation.title,
    content: translation.content,
    userId: translation.userId,
    //userNickname: translation.user?.nickname, // 사용자 닉네임 추가
    challengeId: translation.challengeId,
    likeCount: translation.likeCount,
    isLiked: false, // isLiked는 프론트에서 처리
    createdAt: translation.createdAt,
    updatedAt: translation.updatedAt,
  };
};

/**
 * 번역물을 수정합니다.
 * @param translationId 번역물 ID
 * @param userId 사용자 ID (작성자 본인 확인용)
 * @param updateData 수정할 데이터 (제목, 내용)
 * @returns 수정된 번역물 정보
 */
const updateTranslation = async (
  translationId: string,
  userId: string,
  challengeId: string,
  updateData: { title?: string; content?: string }
): Promise<PostTranslationResponse> => {
  // 번역물 조회 (존재 여부 및 작성자 확인)
  const translation = await prisma.translation.findFirst({
    where: {
      id: translationId,
      userId,
      challengeId,
      deletedAt: null,
    },
  });

  if (!translation) {
    throw {
      statusCode: 404,
      message: `해당 ID의 번역물을 찾을 수 없거나 수정 권한이 없습니다.`,
    };
  }

  // 번역물 수정
  const updatedTranslation = await prisma.translation.update({
    where: { id: translationId },
    data: {
      ...(updateData.title && { title: updateData.title }),
      ...(updateData.content && { content: updateData.content }),
      updatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });

  // 응답 형식에 맞게 데이터 반환
  return {
    id: updatedTranslation.id,
    title: updatedTranslation.title,
    content: updatedTranslation.content,
    userId: updatedTranslation.userId,
    // userNickname: updatedTranslation.user.nickname,
    challengeId: updatedTranslation.challengeId,
    likeCount: updatedTranslation.likeCount,
    createdAt: updatedTranslation.createdAt,
    updatedAt: updatedTranslation.updatedAt,
  };
};

export default {
  getTranslationList,
  postTranslation,
  getTranslationById,
  updateTranslation,
};
