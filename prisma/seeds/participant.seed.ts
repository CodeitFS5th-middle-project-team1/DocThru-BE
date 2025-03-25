import { PrismaClient } from '@prisma/client';

export const seedChallengeParticipants = async (prisma: PrismaClient) => {
  const challengeIds = [
    'a1e23eaa-1bc2-4b19-a9d2-aaaa11111111',
    'b2e23eaa-1bc2-4b19-a9d2-bbbb22222222',
    'c3e23eaa-1bc2-4b19-a9d2-cccc33333333',
    'd4e23eaa-1bc2-4b19-a9d2-dddd44444444',
    'e5e23eaa-1bc2-4b19-a9d2-eeee55555555',
    'f6e23eaa-1bc2-4b19-a9d2-ffff66666666',
  ];

  const userIds = [
    'user-1',
    'user-2',
    'user-3',
    'user-4',
    'user-5',
    'user-6',
    'user-7',
    'user-8',
    'user-9',
    'user-10',
    'user-11',
    'user-12',
  ];

  // userId 하나당 랜덤 챌린지에 참가
  const participants = userIds.map((userId) => {
    const challengeId =
      challengeIds[Math.floor(Math.random() * challengeIds.length)];

    return {
      challengeId,
      userId,
    };
  });

  await prisma.challengeParticipant.createMany({
    data: participants,
    skipDuplicates: true, // 동일 userId & challengeId 중복 방지
  });

  console.log('✅ ChallengeParticipants 12명 랜덤 배정 완료!');
};
