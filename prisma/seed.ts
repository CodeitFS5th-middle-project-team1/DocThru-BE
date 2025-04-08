import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/user.seed';
import { seedAllChallenges } from './seeds/challenge.seed';
import { seedChallengeParticipants } from './seeds/participant.seed';
import { seedDraftTranslations } from './seeds/draftTranslation.seed';
import { seedTranslations } from './seeds/translation.seed';
import { seedLikes } from './seeds/like.seed';
import { seedFeedbacks } from './seeds/feedback.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🗑️ 데이터베이스 초기화 중...');
    await prisma.like.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.translation.deleteMany({});
    await prisma.draftTranslation.deleteMany({});
    await prisma.challengeParticipant.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('✅ 데이터베이스 초기화 완료');

    await seedUsers(prisma);
    await seedAllChallenges(prisma);
    await seedChallengeParticipants(prisma);
    await seedTranslations(prisma);
    await seedLikes(prisma);
    await seedFeedbacks(prisma);
    await seedDraftTranslations(prisma);

  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류 발생:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ 시드 프로세스 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 모든 시드 데이터 생성 완료!');
  });
