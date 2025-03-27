import { PrismaClient } from '@prisma/client';

// Participant 객체를 위한 인터페이스 정의
interface Participant {
  userId: string;
  challengeId: string;
}

export const seedChallengeParticipants = async (prisma: PrismaClient) => {
  // APPROVED 상태인 챌린지만 조회
  const challenges = await prisma.challenge.findMany({
    where: {
      approvalStatus: 'APPROVED',
    },
  });
  const users = await prisma.user.findMany();

  const participants: Participant[] = []; // participants 배열의 타입을 Participant[]로 지정

  for (const user of users) {
    // 각 사용자별로 참여할 챌린지를 1~3개 랜덤 선택
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

  // 데이터베이스에 참여자 데이터 삽입
  await prisma.challengeParticipant.createMany({
    data: participants,
    skipDuplicates: true,
  });

  console.log(
    `✅ ChallengeParticipants 시드 완료 (${participants.length}명 배정됨)`
  );
};
