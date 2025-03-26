import { PrismaClient } from '@prisma/client';

export const seedChallengeParticipants = async (prisma: PrismaClient) => {
  const challenges = await prisma.challenge.findMany(); // 전체 challenge 조회
  const users = await prisma.user.findMany(); // 전체 user 조회

  const participants: { challengeId: string; userId: string }[] = [];

  for (const user of users) {
    // 각 user당 1~3개의 챌린지에 랜덤 참여
    const challengeSamples = [...challenges]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    challengeSamples.forEach((challenge) => {
      participants.push({
        userId: user.id,
        challengeId: challenge.id,
      });
    });
  }

  await prisma.challengeParticipant.createMany({
    data: participants,
    skipDuplicates: true,
  });

  console.log(
    `✅ ChallengeParticipants 시드 완료 (${participants.length}명 배정됨)`
  );
};
