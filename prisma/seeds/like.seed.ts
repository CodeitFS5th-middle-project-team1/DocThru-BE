import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const seedLikes = async () => {
  // 독립된 prisma 인스턴스
  const prisma = new PrismaClient();

  try {
    console.log('좋아요 시드 생성 시작...');

    //데이터 가져오기
    const translations = await prisma.translation.findMany();
    const users = await prisma.user.findMany();

    if (translations.length === 0 || users.length === 0) {
      console.log('⚠️ 번역물 또는 사용자 데이터가 없습니다.');
      return;
    }

    // 기존 좋아요 데이터 삭제

    await prisma.like.deleteMany({});

    await prisma.$executeRaw`UPDATE "translations" SET "likeCount" = 0`;

    // 중복 방지용 Set
    const existingLikes = new Set<string>();
    const likes = [];
    const translationLikeCounts = new Map<string, number>();

    // 번역물별 좋아요 데이터 생성
    for (const translation of translations) {
      const translationId = translation.id;
      const authorId = translation.userId;

      if (!translationId || !authorId) continue;

      // 작성자를 제외한 모든 사용자
      const possibleUsers = users.filter((u) => u.id !== authorId);
      if (possibleUsers.length === 0) {
        translationLikeCounts.set(translationId, 0);
        continue;
      }

      // 0-150개의 랜덤한 좋아요 수 생성
      const maxPossibleLikes = Math.min(possibleUsers.length, 150);
      const likeCount = Math.floor(Math.random() * (maxPossibleLikes + 1));

      // 사용자 배열 섞기
      for (let i = possibleUsers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleUsers[i], possibleUsers[j]] = [
          possibleUsers[j],
          possibleUsers[i],
        ];
      }

      const selectedUsers = possibleUsers.slice(0, likeCount);

      // 이 번역에 대한 좋아요 생성
      for (const user of selectedUsers) {
        const userId = user.id;
        const key = `${translationId}_${userId}`;

        if (!existingLikes.has(key)) {
          likes.push({
            id: uuidv4(),
            translationId: translationId,
            userId: userId,
          });
          existingLikes.add(key);
        }
      }

      translationLikeCounts.set(translationId, selectedUsers.length);
    }

    if (likes.length === 0) {
      console.log('⚠️ 생성된 좋아요 데이터가 없습니다.');
      return;
    }

    // 좋아요 데이터를 배치로 나누어 처리
    const BATCH_SIZE = 1000;

    for (let i = 0; i < likes.length; i += BATCH_SIZE) {
      const batch = likes.slice(i, i + BATCH_SIZE);
      await prisma.like.createMany({
        data: batch,
        skipDuplicates: true,
      });
      console.log(
        `좋아요 생성 진행 중: ${Math.min(i + BATCH_SIZE, likes.length)}/${
          likes.length
        }`
      );
    }

    const UPDATE_BATCH_SIZE = 20;

    for (let i = 0; i < translations.length; i += UPDATE_BATCH_SIZE) {
      const batchTranslations = translations.slice(i, i + UPDATE_BATCH_SIZE);

      // 각 번역물의 좋아요 수 업데이트
      for (const translation of batchTranslations) {
        const count = await prisma.like.count({
          where: { translationId: translation.id },
        });

        await prisma.translation.update({
          where: { id: translation.id },
          data: { likeCount: count },
        });
      }
    }

    console.log(`✅ 좋아요 시드 완료: ${likes.length}개 생성`);

    return likes.length;
  } catch (error) {
    console.error('좋아요 시드 생성 중 오류 발생:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Prisma 연결 종료됨 (좋아요 시드)');
  }
};
