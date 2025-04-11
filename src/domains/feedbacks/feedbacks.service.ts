import prisma from '../../prismaClient';

interface CreateFeedbackParams {
  translationId: string;
  userId: string;
  userNickName: string;
  content: string;
}

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
export const getTranslationAuthorById = async (
  translationId: string
): Promise<{ userId: string } | null> => {
  return prisma.translation.findUnique({
    where: { id: translationId },
    select: { userId: true },
  });
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
