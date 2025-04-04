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
    console.log('🗑️ 기존 데이터 삭제 중...');
    await prisma.like.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.translation.deleteMany({});
    await prisma.draftTranslation.deleteMany({});
    await prisma.challengeParticipant.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ 기존 데이터 삭제 완료');

    console.log('🌱 사용자 데이터 시드 시작...');
    await seedUsers(prisma);

    console.log('🌱 챌린지 데이터 시드 시작...');
    await seedAllChallenges(prisma);

    console.log('🌱 챌린지 참여자 데이터 시드 시작...');
    await seedChallengeParticipants(prisma);

    console.log('🌱 임시 저장 번역물 데이터 시드 시작...');
    await seedDraftTranslations(prisma);

    console.log('🌱 번역물 데이터 시드 시작...');
    await seedTranslations(prisma);

    console.log('🌱 좋아요 데이터 시드 시작...');
    await seedLikes();

    console.log('🌱 피드백 데이터 시드 시작...');
    await seedFeedbacks(prisma);

    console.log('🎉 All seeders done!');
  } catch (error) {
    console.error('❌ 시드 실패:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {});
