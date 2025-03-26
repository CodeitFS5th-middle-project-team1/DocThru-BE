import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const seedLikes = async (prisma: PrismaClient) => {
  // 번역물 및 사용자 데이터 가져오기
  const translations = await prisma.translation.findMany();
  const users = await prisma.user.findMany();

  if (translations.length === 0 || users.length === 0) {
    console.log('⚠️ 번역물 또는 사용자 데이터가 없습니다.');
    return;
  }

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
    const maxPossibleLikes = Math.min(possibleUsers.length, 250);
    const likeCount = Math.floor(Math.random() * (maxPossibleLikes + 1));

    // 사용자 배열 섞기 (Fisher-Yates shuffle)
    for (let i = possibleUsers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleUsers[i], possibleUsers[j]] = [
        possibleUsers[j],
        possibleUsers[i],
      ];
    }

    // 좋아요 수만큼 사용자 선택
    const selectedUsers = possibleUsers.slice(0, likeCount);

    // 이 번역에 대한 좋아요 생성
    for (const user of selectedUsers) {
      const userId = user.id;
      const key = `${translationId}_${userId}`;

      if (!existingLikes.has(key)) {
        // createdAt 필드 제거
        likes.push({
          id: uuidv4(),
          translationId: translationId,
          userId: userId,
        });
        existingLikes.add(key);
      }
    }

    // 이 번역의 실제 좋아요 수 기록
    translationLikeCounts.set(translationId, selectedUsers.length);
  }

  // 기존 좋아요 데이터 삭제
  await prisma.like.deleteMany({});

  // 좋아요 데이터가 없으면 종료
  if (likes.length === 0) {
    console.log('⚠️ 생성된 좋아요 데이터가 없습니다.');
    return;
  }

  // 좋아요 데이터를 배치로 나누어 처리
  const BATCH_SIZE = 1000;
  try {
    for (let i = 0; i < likes.length; i += BATCH_SIZE) {
      const batch = likes.slice(i, i + BATCH_SIZE);
      await prisma.like.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }

    // Translation의 likeCount 필드 업데이트
    for (const [translationId, count] of translationLikeCounts.entries()) {
      await prisma.translation.update({
        where: { id: translationId },
        data: { likeCount: count },
      });
    }

    console.log(
      `✅ 좋아요 시드 완료: ${likes.length}개 생성, ${translations.length}개 번역물 업데이트`
    );
  } catch (error) {
    console.error('❌ 좋아요 시드 생성 중 오류 발생:', error);
  }
};
