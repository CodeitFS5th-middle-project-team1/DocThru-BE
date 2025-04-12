import prisma from '../../prismaClient';
import { PrismaClient } from '@prisma/client';
import { evaluateUserRank } from '../../utils/evaluateUserRank';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

const checkTranslation = async (translationId: string) => {
  const translation = await prisma.translation.findUnique({
    where: { id: translationId },
  });

  return translation;
};

const checkExistingLike = async (translationId: string, userId: string) => {
  const existingLike = await prisma.like.findFirst({
    where: {
      AND: [{ userId }, { translationId }],
    },
  });

  return existingLike;
};

const createLike = async (
  translationId: string,
  userId: string,
  client: PrismaClient | TransactionClient = prisma
) => {
  const like = await client.like.create({
    data: { translationId, userId },
  });

  return like;
};

const deleteLike = async (
  likeId: string,
  client: PrismaClient | TransactionClient = prisma
) => {
  const deletedLike = await client.like.delete({
    where: { id: likeId },
  });

  return deletedLike;
};

const setTranslationLikeCount = async (
  translationId: string,
  isPlus: boolean,
  client: PrismaClient | TransactionClient = prisma
) => {
  const translation = await client.translation.update({
    where: {
      id: translationId,
    },
    data: {
      likeCount: {
        increment: isPlus ? 1 : -1,
      },
    },
  });

  return translation;
};

const createLikeAndPlusTranslationLikeCount = async (
  translationId: string,
  likerUserId: string
) => {
  const translation = await prisma.translation.findUnique({
    where: { id: translationId },
    select: { userId: true },
  });

  if (!translation) throw new Error('번역물이 존재하지 않습니다.');

  const authorUserId = translation.userId;

  const result = await prisma.$transaction(async (tx) => {
    const like = await createLike(translationId, likerUserId, tx);

    await setTranslationLikeCount(translationId, true, tx);
    // 번역물 좋아요 수에 따른 user의 추천 수 증가
    await tx.user.update({
      where: { id: authorUserId },
      data: {
        recommendedCount: {
          increment: 1,
        },
      },
    });

    return like;
  });

  await evaluateUserRank(authorUserId); // 유저 랭크 평가 함수 호출

  return result;
};

const deleteLikeAndMinusTranslationLikeCount = async (
  likeId: string,
  translationId: string
) => {
  const result = await prisma.$transaction(async (tx) => {
    const like = await deleteLike(likeId, tx);
    await setTranslationLikeCount(translationId, false, tx);
    return like;
  });

  return result;
};

export default {
  checkTranslation,
  checkExistingLike,
  createLike,
  deleteLike,
  setTranslationLikeCount,
  createLikeAndPlusTranslationLikeCount,
  deleteLikeAndMinusTranslationLikeCount,
};
