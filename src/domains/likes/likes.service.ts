import prisma from '../../prismaClient';
import { PrismaClient } from '@prisma/client';

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
  userId: string
) => {
  const result = await prisma.$transaction(async (tx) => {
    const like = await createLike(translationId, userId, tx);
    await setTranslationLikeCount(translationId, true, tx);
    return like;
  });

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
