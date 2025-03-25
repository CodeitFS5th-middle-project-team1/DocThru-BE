import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/user.seed';
import { seedChallenges } from './seeds/challenge.seed';
import { seedChallengeParticipants } from './seeds/participant.seed';
import { seedDraftTranslations } from './seeds/draftTranslation.seed';
import { seedTranslations } from './seeds/translation.seed';
import { seedLikes } from './seeds/like.seed';
import { seedFeedbacks } from './seeds/feedback.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedChallenges(prisma);
  await seedChallengeParticipants(prisma);
  await seedDraftTranslations(prisma);
  await seedTranslations(prisma);
  await seedFeedbacks(prisma);
  await seedLikes(prisma); //
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
