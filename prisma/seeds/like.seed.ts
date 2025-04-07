import { PrismaClient } from '@prisma/client';

export const seedLikes = async (prisma: PrismaClient) => {
  console.log('좋아요 시드 데이터 생성 시작...');

  // 모든 번역물과 사용자 데이터 조회
  const translations = await prisma.translation.findMany({
    select: {
      id: true,
      userId: true,
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (translations.length === 0 || users.length === 0) {
    console.log('⚠️ 번역물 또는 사용자 데이터가 없습니다.');
    return;
  }

  // 기존 좋아요 데이터 초기화
  await prisma.like.deleteMany();
  await prisma.$executeRaw`UPDATE "translations" SET "likeCount" = 0`;

  const likes = [];
  const existingLikes = new Set<string>();

  // 각 번역물에 대해 좋아요 생성
  for (const translation of translations) {
    // 70%의 확률로 좋아요를 받음
    if (Math.random() > 0.7) continue;

    // 좋아요 수 결정
    const likeCount = Math.min(
      Math.floor(Math.random() * 10),
      Math.floor(users.length * 0.7) // 최대 유저 수의 70%까지만 좋아요 가능
    );

    if (likeCount === 0) continue;

    // 사용자 배열을 섞어서 랜덤하게 선택
    const shuffledUsers = [...users]
      .sort(() => Math.random() - 0.5)
      .slice(0, likeCount);

    for (const user of shuffledUsers) {
      const key = `${translation.id}_${user.id}`;

      // 중복 좋아요 방지
      if (!existingLikes.has(key)) {
        likes.push({
          translationId: translation.id,
          userId: user.id,
        });
        existingLikes.add(key);
      }
    }
  }

  // 좋아요 데이터 배치 처리
  const BATCH_SIZE = 1000;
  for (let i = 0; i < likes.length; i += BATCH_SIZE) {
    const batch = likes.slice(i, i + BATCH_SIZE);
    await prisma.like.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  // 각 번역물의 좋아요 수 업데이트
  for (const translation of translations) {
    const likeCount = await prisma.like.count({
      where: { translationId: translation.id },
    });

    await prisma.translation.update({
      where: { id: translation.id },
      data: { likeCount },
    });
  }

  // 데이터 검증
  let totalLikes = 0;
  let translationsWithLikes = 0;
  for (const translation of translations) {
    const dbLikeCount = await prisma.translation.findUnique({
      where: { id: translation.id },
      select: { likeCount: true },
    });

    const actualLikeCount = await prisma.like.count({
      where: { translationId: translation.id },
    });

    if (dbLikeCount?.likeCount !== actualLikeCount) {
      console.warn(
        `⚠️ 불일치 발견: 번역물 ID ${translation.id}의 좋아요 수가 일치하지 않습니다.`,
        `DB: ${dbLikeCount?.likeCount}, 실제: ${actualLikeCount}`
      );
    }
    if (actualLikeCount > 0) {
      translationsWithLikes++;
    }
    totalLikes += actualLikeCount;
  }

  console.log(
    `✅ 좋아요 시드 데이터 생성 완료!`,
    `\n총 ${totalLikes}개의 좋아요가 생성되었습니다.`,
    `\n${translationsWithLikes}개의 번역물이 좋아요를 받았습니다.`,
    `\n평균 좋아요 수: ${(totalLikes / translationsWithLikes).toFixed(1)}개`
  );
};
