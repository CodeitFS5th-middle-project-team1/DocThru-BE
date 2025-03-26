import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const seedFeedbacks = async (prisma: PrismaClient) => {
  const translations = await prisma.translation.findMany();
  const users = await prisma.user.findMany();

  type CreateFeedbackInput = {
    id: string;
    translationId: string;
    userId: string;
    userNickname: string;
    userProfileImg?: string | null;
    content: string;
  };

  const feedbacks: CreateFeedbackInput[] = [];

  for (const translation of translations) {
    const feedbackCount = Math.floor(Math.random() * 2) + 1;

    const feedbackUsers = users
      .filter((u) => u.id !== translation.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, feedbackCount);

    for (const user of feedbackUsers) {
      feedbacks.push({
        id: uuidv4(),
        translationId: translation.id,
        userId: user.id,
        userNickname: user.nickname,
        userProfileImg: null,
        content: getRandomFeedbackComment(),
        // Prisma createMany에서 자동 필드 제외
      });
    }
  }

  await prisma.feedback.createMany({
    data: feedbacks,
    skipDuplicates: true,
  });

  console.log(`✅ Feedback 시드 완료 (${feedbacks.length}개 생성)`);
};

function getRandomFeedbackComment(): string {
  const comments = [
    '내용이 깔끔하고 이해하기 쉬워요!',
    '예시 부분을 조금 더 구체적으로 번역하면 좋을 것 같아요.',
    '자연스러운 표현이 인상적이네요 👏',
    '기술 용어 번역이 정확해서 좋았어요.',
    '조금만 다듬으면 더 완성도 높을 것 같아요.',
    '잘 읽히는 번역입니다. 수고 많으셨어요!',
  ];

  return comments[Math.floor(Math.random() * comments.length)];
}
