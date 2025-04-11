import { UserRole } from '@prisma/client';
import prisma from '../../prismaClient';
import CustomError from '../../types/error';
import {
  TranslationListResponse,
  TranslationResponse,
  TranslationRequestParams,
  TranslationRequestListQuery,
  TranslationRequestBody,
} from './translations.types';

// 번역물 목록 조회
const getTranslationList = async ({
  challengeId,
  page,
  limit,
}: TranslationRequestParams &
  TranslationRequestListQuery): Promise<TranslationListResponse> => {
  const pageNum = Number(page || 1);
  const limitNum = Number(limit || 5);

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
    translations: translations.map((translation) => ({
      id: translation.id,
      title: translation.title,
      content: translation.content,
      user: {
        id: translation.userId,
        nickname: translation.user?.nickname || null,
      },
      challengeId: translation.challengeId,
      likeCount: translation.likeCount,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    })),
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
    select: { id: true, documentType: true, field: true },
  });

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
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });

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
    user: {
      id: translation.userId,
      nickname: translation.user?.nickname || null,
    },
    challengeId: translation.challengeId,
    likeCount: translation.likeCount,
    isLiked,
    documentType: challenge.documentType,
    field: challenge.field,
    createdAt: translation.createdAt,
    updatedAt: translation.updatedAt,
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
const createTranslation = async ({
  title,
  content,
  userId,
  challengeId,
}: TranslationRequestBody & {
  userId: string;
  challengeId: string;
}): Promise<TranslationResponse> => {
  try {
    // 챌린지 존재 여부 및 승인 상태 확인
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        userId: true,
        isParticipantsFull: true,
        isDeadlineFull: true,
        maxParticipants: true,
        currentParticipants: true,
        approvalStatus: true,
      },
    });

    if (!challenge) {
      throw new CustomError(
        404,
        `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`
      );
    }
    if (challenge.approvalStatus !== 'APPROVED') {
      throw new CustomError(
        403,
        `이 챌린지는 ${
          challenge.approvalStatus === 'PENDING'
            ? '아직 승인 대기 중이'
            : challenge.approvalStatus === 'REJECTED'
            ? '관리자에 의해 승인이 거절되었으'
            : '관리자에 의해 삭제되었으'
        } 므로 번역물을 제출할 수 없습니다.`
      );
    }
    // 참가자 수 마감 || 기간 마감 확인
    if (challenge.isParticipantsFull || challenge.isDeadlineFull) {
      throw new CustomError(
        403,
        `이 챌린지는 ${
          challenge.isParticipantsFull ? '참가자 수 제한' : '마감 기한'
        }으로 인해 더 이상 번역물을 제출할 수 없습니다.`
      );
    }
    // 사용자가 이미 해당 챌린지에 대한 번역을 생성한적있느지 확인
    const existingTranslation = await prisma.translation.findFirst({
      where: {
        challengeId,
        userId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existingTranslation) {
      throw new Error(
        '이미 이 챌린지에 번역물을 제출하셨습니다. 한 챌린지당 하나의 번역물만 제출할 수 있습니다.'
      );
    }

    // 트랜잭션 사용하여 번역물 생성과 챌린지 정보 업데이트 수행
    const result = await prisma.$transaction(async (prismaClient) => {
      const translation = await prismaClient.translation.create({
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

      // 현재 참가자 수 +1
      const newParticipantCount = challenge.currentParticipants + 1;

      // 참가자 수 마감 여부 확인
      const isFullNow = newParticipantCount >= challenge.maxParticipants;

      //챌린지 정보 업데이트
      await prismaClient.challenge.update({
        where: { id: challengeId },
        data: {
          currentParticipants: newParticipantCount,
          isParticipantsFull: isFullNow,
        },
      });

      // 관련된 임시 저장 데이터 삭제
      await prismaClient.draftTranslation.deleteMany({
        where: {
          userId,
          challengeId,
        },
      });

      return translation;
    });

    return {
      id: result.id,
      title: result.title,
      content: result.content,
      user: {
        id: userId,
        nickname: result.user?.nickname || null,
      },
      challengeId: result.challengeId,
      likeCount: result.likeCount,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  } catch (error) {
    console.error('번역물 생성 중 오류 발생:', {
      challengeId,
      userId,
      error,
    });

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      500,
      error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.'
    );
  }
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
    // 챌린지 유효성 및 마감기한 확인
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: { isDeadlineFull: true },
    });

    if (!challenge) {
      throw new CustomError(404, '존재하지 않거나 이미 삭제된 챌린지입니다.');
    }

    // 마감기한이 지났으면 누구도 수정 불가
    if (challenge.isDeadlineFull) {
      throw new CustomError(403, '챌린지 마감기한이 지나 수정할 수 없습니다.');
    }

    // 번역 유효성 검사
    const translation = await prisma.translation.findUnique({
      where: {
        id: translationId,
        challengeId,
        deletedAt: null,
      },
      include: {
        user: { select: { id: true, nickname: true } },
      },
    });

    if (!translation) {
      throw new CustomError(
        404,
        `번역물 ID ${translationId}를 찾을 수 없습니다.`
      );
    }

    // 작성자 또는 관리자만 수정 가능 (마감기한이 지나지 않은 경우)
    const isOwner = translation.userId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new CustomError(403, '이 번역물에 대한 수정 권한이 없습니다.');
    }

    // 수정할 데이터가 없는 경우 (제목이나 내용 중 하나는 입력되어야함)
    if (!updateData.title && !updateData.content) {
      throw new CustomError(400, '수정할 내용을 입력해주세요.');
    }

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
      user: {
        id: translation.user.id,
        nickname: updatedTranslation.user?.nickname || null,
      },
      challengeId: updatedTranslation.challengeId,
      likeCount: updatedTranslation.likeCount,
      createdAt: updatedTranslation.createdAt,
      updatedAt: updatedTranslation.updatedAt,
    };
  } catch (error) {
    if (!(error instanceof CustomError)) {
      console.error('번역물 수정 중 오류 발생:', {
        translationId,
        challengeId,
        error,
      });
      throw new CustomError(
        500,
        error instanceof Error
          ? error.message
          : '서버 내부 오류가 발생했습니다.'
      );
    }

    throw error;
  }
};

/**
 * 번역물을 삭제합니다. 작성자 본인 또는 관리자만 삭제할 수 있습니다.
 * @param translationId 삭제할 번역물 ID
 * @param challengeId 챌린지 ID
 * @param userId 요청한 사용자 ID
 * @param userRole 요청한 사용자의 역할 (권한 확인용)
 * @returns 삭제 성공 여부
 */
const deleteTranslation = async ({
  translationId,
  challengeId,
  userId,
  userRole,
}: {
  translationId: string;
  challengeId: string;
  userId: string;
  userRole?: UserRole;
}): Promise<{ success: boolean }> => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: {
        isDeadlineFull: true,
        currentParticipants: true,
        isParticipantsFull: true,
        maxParticipants: true,
        approvalStatus: true,
      },
    });
    if (!challenge) {
      throw new CustomError(
        404,
        `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`
      );
    }

    if (challenge.approvalStatus === 'DELETED') {
      throw new CustomError(400, `이미 삭제된 챌린지의 번역물입니다.`);
    }

    // 마감기한이 지났으면 누구도 삭제 불가
    if (challenge.isDeadlineFull) {
      throw new CustomError(403, '챌린지 마감기한이 지나 삭제할 수 없습니다.');
    }

    const translation = await prisma.translation.findUnique({
      where: {
        id: translationId,
        challengeId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!translation) {
      throw new CustomError(
        404,
        `번역물 ID ${translationId}를 찾을 수 없거나 이미 삭제되었습니다.`
      );
    }

    // 권한 확인 - 작성자 또는 관리자만 삭제 가능
    const isOwner = translation.userId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new CustomError(403, '이 번역물에 대한 삭제 권한이 없습니다.');
    }

    // 트랜잭션으로 처리
    await prisma.$transaction(async (prismaClient) => {
      // 번역물 soft delete
      await prismaClient.translation.update({
        where: { id: translationId },
        data: { deletedAt: new Date() },
      });

      // 참가자 수 관리
      // 마감 기한이 지나지 않은 경우, 참가자수 - 1

      if (!challenge.isDeadlineFull) {
        if (challenge.currentParticipants > 0) {
          const newParticipantCount = challenge.currentParticipants - 1;

          await prismaClient.challenge.update({
            where: { id: challengeId },
            data: {
              currentParticipants: newParticipantCount,
              isParticipantsFull: false, // 번역물 삭제 후에는 항상 false
            },
          });
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('번역물 삭제 중 오류 발생:', {
      challengeId,
      translationId,
      error,
    });

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError(
      500,
      error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.'
    );
  }
};

export const TranslationsService = {
  getTranslationList,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation,
};
