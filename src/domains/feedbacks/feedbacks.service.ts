import prisma from '../../prismaClient';

interface CreateFeedbackParams {
  translationId: string;
  userId: string;
  userNickName: string;
  content: string;
}
interface ChallengeInfo {
  id: string;
  title: string;
}

export const getTranslationAuthorById = async (
  translationId: string
): Promise<{ userId: string } | null> => {
  return prisma.translation.findUnique({
    where: { id: translationId },
    select: { userId: true },
  });
};

export const getTranslationChallengeInfo = async (
  translationId: string
): Promise<ChallengeInfo | null> => {
  try {
    const translationWithChallenge = await prisma.translation.findUnique({
      where: { id: translationId },
      select: {
        challenge: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return translationWithChallenge?.challenge || null;
  } catch (error) {
    console.error(
      `번역물(${translationId})의 챌린지 정보 조회 중 오류:`,
      error
    );
    return null;
  }
};
const checkTranslations = async (translationId: string) => {
  const translation = await prisma.translation.findUnique({
    where: {
      id: translationId,
    },
  });
  return translation;
};

const fetchFeedbackList = async (translationId: string) => {
  const feedbacks = await prisma.feedback.findMany({
    where: {
      translationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return feedbacks;
};

const createFeedback = async ({
  translationId,
  userId,
  userNickName,
  content,
}: CreateFeedbackParams) => {
  const feedback = await prisma.feedback.create({
    data: {
      translationId,
      userId,
      userNickname: userNickName,
      content,
    },
  });
  return feedback;
};

const checkFeedbackByID = async (feedbackId: string) => {
  const feedback = await prisma.feedback.findUnique({
    where: {
      id: feedbackId,
    },
  });
  return feedback;
};

const updateFeedback = async (feedbackId: string, content: string) => {
  const feedback = await prisma.feedback.update({
    where: {
      id: feedbackId,
    },
    data: {
      content,
    },
  });
  return feedback;
};

const deleteFeedback = async (feedbackId: string) => {
  const feedback = await prisma.feedback.delete({
    where: {
      id: feedbackId,
    },
  });
  return feedback;
};

export default {
  fetchFeedbackList,
  checkTranslations,
  createFeedback,
  checkFeedbackByID,
  updateFeedback,
  deleteFeedback,
  getTranslationAuthorById,
};
