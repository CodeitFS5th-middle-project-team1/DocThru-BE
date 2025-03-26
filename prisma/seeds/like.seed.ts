import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const seedLikes = async (prisma: PrismaClient) => {
  const translations = await prisma.translation.findMany();
  const users = await prisma.user.findMany();

  // 중복 방지용 Set
  const existingLikes = new Set<string>();

  type LikeInput = {
    id: string;
    translationId: string;
    userId: string;
  };

  const likes: LikeInput[] = [];

  for (const translation of translations) {
    const likeCount = Math.floor(Math.random() * 5) + 1; // 1~5명 좋아요
    const possibleUsers = users.filter((u) => u.id !== translation.userId); // 작성자 제외
    const shuffled = possibleUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, likeCount);

    for (const user of shuffled) {
      const key = `${translation.id}_${user.id}`;
      if (!existingLikes.has(key)) {
        likes.push({
          id: uuidv4(),
          translationId: translation.id,
          userId: user.id,
        });
        existingLikes.add(key);
      }
    }
  }

  await prisma.like.createMany({
    data: likes,
    skipDuplicates: true,
  });

  console.log(`❤️ Like 시드 완료 (${likes.length}개 생성)`);
};
