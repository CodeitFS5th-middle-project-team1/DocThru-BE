import { PrismaClient } from '@prisma/client';

export const seedFeedbacks = async (prisma: PrismaClient) => {
  console.log('피드백 시드 데이터 생성 시작...');

  // 번역물과 사용자 데이터 조회
  const translations = await prisma.translation.findMany({
    select: {
      id: true,
      userId: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nickname: true,
      profileImg: true,
    },
  });

  if (translations.length === 0 || users.length === 0) {
    console.log('⚠️ 번역물 또는 사용자 데이터가 없습니다.');
    return;
  }

  const feedbacks = [];
  const existingFeedbacks = new Set<string>(); // 중복 피드백 방지용

  // 각 번역물에 대해 피드백 생성
  for (const translation of translations) {
    // 80%의 확률로 피드백을 받음
    if (Math.random() > 0.8) continue;

    // 번역물 작성자를 제외한 사용자들
    const availableUsers = users.filter(
      (user) => user.id !== translation.userId
    );

    // 0-5개의 랜덤한 피드백 수 결정
    const feedbackCount = Math.floor(Math.random() * 6);

    if (feedbackCount === 0 || availableUsers.length === 0) continue;

    // 사용자 배열을 섞어서 랜덤하게 선택
    const selectedUsers = [...availableUsers]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(feedbackCount, availableUsers.length));

    for (const user of selectedUsers) {
      const key = `${translation.id}_${user.id}`;

      // 중복 피드백 방지
      if (!existingFeedbacks.has(key)) {
        feedbacks.push({
          translationId: translation.id,
          userId: user.id,
          userNickname: user.nickname,
          userProfileImg: user.profileImg,
          content: getRandomFeedbackComment(),
        });
        existingFeedbacks.add(key);
      }
    }
  }

  // 피드백 데이터 배치 처리
  const BATCH_SIZE = 1000;
  for (let i = 0; i < feedbacks.length; i += BATCH_SIZE) {
    const batch = feedbacks.slice(i, i + BATCH_SIZE);
    await prisma.feedback.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  // 데이터 검증 및 통계
  const totalFeedbacks = await prisma.feedback.count();
  const translationsWithFeedback = await prisma.translation.count({
    where: {
      feedbacks: {
        some: {},
      },
    },
  });

  console.log(
    `✅ 피드백 시드 데이터 생성 완료!`,
    `\n총 ${totalFeedbacks}개의 피드백이 생성되었습니다.`,
    `\n${translationsWithFeedback}개의 번역물이 피드백을 받았습니다.`,
    `\n평균 피드백 수: ${(totalFeedbacks / translationsWithFeedback).toFixed(
      1
    )}개`
  );
};

function getRandomFeedbackComment(): string {
  const comments = [
    '번역이 자연스럽고 이해하기 쉬워요!',
    '기술적인 용어 선택이 정확해서 좋았습니다.',
    '전체적으로 잘 읽히는 번역이에요. 👍',
    '예시 부분이 특히 이해하기 쉽게 번역되었네요.',
    '전문성이 잘 드러나는 번역입니다.',
    '깔끔하고 명확한 번역이에요.',
    '문맥을 잘 살린 번역이라 읽기 좋았습니다.',
    '전반적으로 좋은 번역이에요! 수고하셨습니다.',
    '원문의 의도를 잘 살린 번역이네요.',
    '전문 용어 번역이 일관성 있어서 좋았어요.',
    '가독성이 높은 번역입니다.',
    '좋은 번역 감사합니다! 많이 배웠어요.',
    '번역 품질이 훌륭합니다. 다음 번역도 기대할게요!',
    '전문적이면서도 쉽게 읽히는 번역이에요.',
    '원문의 뉘앙스를 잘 살리셨네요.',
  ];

  return comments[Math.floor(Math.random() * comments.length)];
}
