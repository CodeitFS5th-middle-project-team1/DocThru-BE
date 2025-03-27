import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// 더 넓은 타입으로 매개변수 정의 (any 타입을 사용하는 것보다 좋은 방법)
export const seedLikes = async (
  prisma:
    | PrismaClient
    | Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >
) => {
  // 트랜잭션 코드 제거 (상위 레벨에서 트랜잭션이 제공됨)
  console.log('좋아요 시드 생성 시작...');

  // 번역물 및 사용자 데이터 가져오기
  const translations = await prisma.translation.findMany();
  const users = await prisma.user.findMany();

  if (translations.length === 0 || users.length === 0) {
    console.log('⚠️ 번역물 또는 사용자 데이터가 없습니다.');
    return;
  }

  // 기존 좋아요 데이터 삭제
  console.log('기존 좋아요 데이터 삭제 중...');
  await prisma.like.deleteMany({});
  console.log('기존 좋아요 데이터 삭제 완료');

  // Translation의 likeCount 초기화
  console.log('번역물 좋아요 수 초기화 중...');
  await prisma.$executeRaw`UPDATE translations SET "likeCount" = 0`;
  console.log('번역물 좋아요 수 초기화 완료');

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

  // 좋아요 데이터가 없으면 종료
  if (likes.length === 0) {
    console.log('⚠️ 생성된 좋아요 데이터가 없습니다.');
    return;
  }

  // 좋아요 데이터를 배치로 나누어 처리
  const BATCH_SIZE = 1000;
  console.log(`좋아요 데이터 생성 중 (총 ${likes.length}개)...`);

  for (let i = 0; i < likes.length; i += BATCH_SIZE) {
    const batch = likes.slice(i, i + BATCH_SIZE);
    await prisma.like.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log('좋아요 데이터 생성 완료');

  // Translation의 likeCount 필드 업데이트
  console.log('번역물 좋아요 수 업데이트 중...');

  // 데이터베이스 쿼리를 사용해 직접 좋아요 수 계산하여 업데이트
  for (const translation of translations) {
    const count = await prisma.like.count({
      where: { translationId: translation.id },
    });

    await prisma.translation.update({
      where: { id: translation.id },
      data: { likeCount: count },
    });
  }

  console.log('번역물 좋아요 수 업데이트 완료');

  // 확인을 위한 검증 쿼리
  console.log('데이터 검증 중...');
  for (const translation of translations) {
    const likeCount = await prisma.translation.findUnique({
      where: { id: translation.id },
      select: { likeCount: true },
    });

    const actualLikes = await prisma.like.count({
      where: { translationId: translation.id },
    });

    if (likeCount?.likeCount !== actualLikes) {
      console.warn(
        `⚠️ 불일치 발견: 번역물 ID ${translation.id}, DB likeCount: ${likeCount?.likeCount}, 실제 좋아요 수: ${actualLikes}`
      );
    }
  }

  console.log(
    `✅ 좋아요 시드 완료: ${likes.length}개 생성, ${translations.length}개 번역물 업데이트`
  );
};
