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
  await prisma.like.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.translation.deleteMany({});
  await prisma.draftTranslation.deleteMany({});
  await prisma.challengeParticipant.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.user.deleteMany({});

  await seedUsers(prisma);
  await seedAllChallenges(prisma);
  await seedChallengeParticipants(prisma);
  await seedDraftTranslations(prisma);

  // Translation과 Like를 하나의 트랜잭션으로 처리
  await prisma.$transaction(async (tx) => {
    await seedTranslations(tx);
    await seedLikes(tx);
  });

  await seedFeedbacks(prisma);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🌱 All seeders done!');
  });
