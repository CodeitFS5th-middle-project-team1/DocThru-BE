import { PrismaClient, ApprovalStatus } from '@prisma/client';

// Participant 객체를 위한 인터페이스 정의
interface Participant {
  userId: string;
  challengeId: string;
}

export const seedChallengeParticipants = async (prisma: PrismaClient) => {
  console.log('👥 챌린지 참가자 시드 데이터 생성 중...');

  // 승인된(APPROVED) 챌린지만 가져오기
  const approvedChallenges = await prisma.challenge.findMany({
    where: {
      approvalStatus: ApprovalStatus.APPROVED,
      isParticipantsFull: false,
    },
    select: {
      id: true,
      maxParticipants: true,
    },
  });

  // 일반 유저만 가져오기
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
    select: {
      id: true,
    },
  });

  const participants: Participant[] = [];
  const challengeParticipants = new Map<string, number>();

  // 각 유저별로 처리
  for (const user of users) {
    // 각 유저가 참여할 챌린지 수를 5~20개 사이로 랜덤 결정
    const numberOfChallenges = Math.floor(Math.random() * 16) + 5;

    // 아직 참여 가능한 챌린지들 필터링
    const availableChallenges = approvedChallenges.filter((challenge) => {
      const currentCount = challengeParticipants.get(challenge.id) || 0;
      return currentCount < challenge.maxParticipants;
    });

    if (availableChallenges.length === 0) continue;

    // 랜덤하게 챌린지 선택 (최대 20개)
    const selectedChallenges = availableChallenges
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(numberOfChallenges, availableChallenges.length));

    // 선택된 챌린지에 유저 참여 처리
    for (const challenge of selectedChallenges) {
      const currentCount = challengeParticipants.get(challenge.id) || 0;

      if (currentCount < challenge.maxParticipants) {
        participants.push({
          userId: user.id,
          challengeId: challenge.id,
        });

        // 해당 챌린지의 참가자 수 증가
        challengeParticipants.set(challenge.id, currentCount + 1);
      }
    }
  }

  // 트랜잭션으로 참가자 데이터 생성 및 챌린지 상태 업데이트
  await prisma.$transaction(async (tx) => {
    // 1. 참가자 데이터 생성
    await tx.challengeParticipant.createMany({
      data: participants,
      skipDuplicates: true,
    });

    // 2. 각 챌린지의 참가자 수와 상태 업데이트
    const updatePromises = Array.from(challengeParticipants.entries()).map(
      ([challengeId, participantCount]) => {
        return tx.challenge.update({
          where: { id: challengeId },
          data: {
            currentParticipants: participantCount,
            isParticipantsFull:
              participantCount >=
              (approvedChallenges.find((c) => c.id === challengeId)
                ?.maxParticipants || 0),
          },
        });
      }
    );

    await Promise.all(updatePromises);
  });

  console.log(`✅ ${participants.length}개의 챌린지 참가 데이터 생성 완료!`);
};
