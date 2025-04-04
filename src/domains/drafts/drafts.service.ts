import prisma from '../../prismaClient';
import CustomError from '../../types/error';
import {
  DraftTranslationParams,
  DraftTranslationRequestBody,
  DraftTranslationResponse,
} from './drafts.type';

/**
 * 임시 저장 번역물 생성/업데이트 (upsert 사용)
 */
const createOrUpdateDraftTranslation = async ({
  title,
  content,
  userId,
  challengeId,
}: DraftTranslationRequestBody &
  DraftTranslationParams): Promise<DraftTranslationResponse> => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!challenge) {
      throw new CustomError(
        404,
        `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`
      );
    }
    if (!title && !content) {
      throw new CustomError(
        400,
        '저장할 내용이 없습니다. 제목이나 내용을 입력해주세요.'
      );
    }

    const draftTranslation = await prisma.draftTranslation.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      create: {
        title: title || '',
        content: content || '',
        userId,
        challengeId,
      },
      update: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
      },
    });

    return {
      id: draftTranslation.id,
      title: draftTranslation.title,
      content: draftTranslation.content,
      userId: draftTranslation.userId,
      challengeId: draftTranslation.challengeId,
      createdAt: draftTranslation.createdAt,
      updatedAt: draftTranslation.updatedAt,
      message: '작성 내용이 임시저장되었습니다.',
    };
  } catch (error) {
    console.error('임시 저장 번역물 생성/업데이트 중 오류 발생:', {
      userId,
      challengeId,
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
 * 임시 저장 번역물 조회
 * @param userId 사용자 ID
 * @param challengeId 챌린지 ID
 * @returns 임시 저장된 번역물 정보 || null
 */
const getDraftTranslation = async ({
  userId,
  challengeId,
}: DraftTranslationParams): Promise<DraftTranslationResponse | null> => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!challenge) {
      throw new CustomError(
        404,
        `챌린지 ID ${challengeId}를 찾을 수 없거나 이미 삭제되었습니다.`
      );
    }

    const draftTranslation = await prisma.draftTranslation.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    // 임시 저장이 없는 경우 null
    if (!draftTranslation) {
      return null;
    }

    return {
      id: draftTranslation.id,
      title: draftTranslation.title,
      content: draftTranslation.content,
      userId: draftTranslation.userId,
      challengeId: draftTranslation.challengeId,
      createdAt: draftTranslation.createdAt,
      updatedAt: draftTranslation.updatedAt,
    };
  } catch (error) {
    console.error('임시 저장한 번역물 조회 중 오류 발생:', {
      userId,
      challengeId,
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

export default {
  createOrUpdateDraftTranslation,
  getDraftTranslation,
};
