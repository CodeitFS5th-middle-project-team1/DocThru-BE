import { PrismaClient, UserRole, UserRank } from '@prisma/client';
import bcrypt from 'bcrypt';

const generateTestUser = async (index: number) => {
  const nickname = `test${index}`;
  const email = `${nickname}@test.com`;
  const password = await bcrypt.hash('password', 10);
  const role = index === 0 ? UserRole.ADMIN : UserRole.USER;
  const rank = UserRank.NORMAL;

  return {
    email,
    nickname,
    password,
    role,
    rank,
  };
};

export const createTestUsers = async (prisma: PrismaClient, count: number) => {
  const users = await Promise.all(
    Array(count)
      .fill(null)
      .map((_, index) => generateTestUser(index))
  );

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
};

export const seedUsers = async (prisma: PrismaClient) => {
  const seedCount = 20;

  console.log('👤 사용자 시드 데이터 생성 중...');

  // 테스트 유저 20명 생성
  await createTestUsers(prisma, seedCount);

  console.log(`✅ 테스트 유저 ${seedCount}명 생성 완료`);
};
