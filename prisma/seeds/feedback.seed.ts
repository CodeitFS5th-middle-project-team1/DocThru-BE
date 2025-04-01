import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const seedFeedbacks = async (prisma: PrismaClient) => {
  const translations = await prisma.translation.findMany();
  const users = await prisma.user.findMany();

  type CreateFeedbackInput = {
    id: string;
    idx: number;
    translationId: string;
    userId: string;
    userNickname: string;
    userProfileImg?: string | null;
    content: string;
  };

  let idx = 0;

  const feedbacks: CreateFeedbackInput[] = [];

  for (const translation of translations) {
    const feedbackCount = Math.floor(Math.random() * 3) + 1; // 최소 1개 ~ 최대 3개

    const feedbackUsers = users
      .filter((u) => u.id !== translation.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, feedbackCount);

    for (const user of feedbackUsers) {
      feedbacks.push({
        id: uuidv4(),
        idx: idx++,
        translationId: translation.id,
        userId: user.id,
        userNickname: user.nickname,
        userProfileImg: null,
        content: getRandomFeedbackComment(),
      });
    }
  }

  await prisma.feedback.createMany({
    data: feedbacks,
    skipDuplicates: true,
  });

  console.log(`✅ Feedback 시드 완료 (총 ${feedbacks.length}개 생성됨)`);
};

function getRandomFeedbackComment(): string {
  const comments = [
    '내용이 깔끔하고 이해하기 쉬워요!',
    '예시 부분을 조금 더 구체적으로 번역하면 좋을 것 같아요.',
    '자연스러운 표현이 인상적이네요 👏',
    '기술 용어 번역이 정확해서 좋았어요.',
    '조금만 다듬으면 더 완성도 높을 것 같아요.',
    '잘 읽히는 번역입니다. 수고 많으셨어요!',
    '구체적인 예시 덕분에 이해가 쉬웠어요!',
    '용어 선택이 일관되고 전문적이에요.',
    '표현이 조금 어색한 부분이 있지만 전반적으로 좋습니다.',
    '형식이 잘 정리되어 있어 가독성이 높아요.',
    '단어 선택이 매끄럽고 자연스러웠어요.',
    '다음에도 이런 번역 기대할게요 👍',
  ];

  return comments[Math.floor(Math.random() * comments.length)];
}
