import prisma from '../../prismaClient';

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
  });
  return feedbacks;
};

export default {
  fetchFeedbackList,
  checkTranslations,
};
