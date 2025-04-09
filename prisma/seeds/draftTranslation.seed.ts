import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

type ChallengeWithParticipants = {
  id: string;
  title: string;
  challengeParticipants: {
    userId: string;
  }[];
};

export const seedDraftTranslations = async (prisma: PrismaClient) => {
  console.log('임시 저장 시드 데이터 생성 시작...');

  // APPROVED 상태인 챌린지와 참가자 정보 조회
  const challenges = await prisma.challenge.findMany({
    where: {
      approvalStatus: 'APPROVED',
    },
    select: {
      id: true,
      title: true,
      challengeParticipants: {
        select: {
          userId: true,
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  if (challenges.length === 0 || users.length === 0) {
    console.log('⚠️ 챌린지 또는 사용자 데이터가 없습니다.');
    return;
  }

  // 기존 임시 저장 데이터 초기화
  await prisma.draftTranslation.deleteMany();

  const drafts = [];
  const existingDrafts = new Set<string>(); // 중복 방지용 (userId_challengeId)

  // 임시 저장 내용 템플릿
  const draftTemplates = [
    {
      title: '초안 - API 문서 번역',
      content:
        '# API 개요\n\n이 문서는 API의 기본 사용법을 설명합니다...\n\n## 인증\n\n인증 방식은 다음과 같습니다...\n\n(추가 번역 예정)',
    },
    {
      title: '초안 - 기술 가이드',
      content:
        '# 시작하기\n\n이 가이드는 초보자를 위한 기본 설정을 다룹니다...\n\n## 설치\n\n다음 단계를 따라 설치를 진행하세요...\n\n(작성 중)',
    },
    {
      title: '초안 - 개발자 문서',
      content:
        '# 개발자 가이드\n\n이 문서는 개발자를 위한 상세 구현 방법을 설명합니다...\n\n## 구조\n\n프로젝트 구조는 다음과 같습니다...\n\n(검토 필요)',
    },
  ];

  // 각 챌린지에 대해 임시 저장 생성
  for (const challenge of challenges as ChallengeWithParticipants[]) {
    // 이미 참여한 유저 ID 목록
    const participantUserIds = new Set(
      challenge.challengeParticipants.map((p) => p.userId)
    );

    // 참여하지 않은 유저만 필터링
    const availableUsers = users.filter(
      (user) => !participantUserIds.has(user.id)
    );

    if (availableUsers.length === 0) continue;

    // 30%의 확률로 임시 저장 생성
    if (Math.random() > 0.3) continue;

    // 1-3명의 랜덤한 유저 선택
    const userCount = Math.floor(Math.random() * 3) + 1;
    const selectedUsers = [...availableUsers]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(userCount, availableUsers.length));

    for (const user of selectedUsers) {
      const key = `${user.id}_${challenge.id}`;

      // 중복 임시 저장 방지
      if (!existingDrafts.has(key)) {
        const template =
          draftTemplates[Math.floor(Math.random() * draftTemplates.length)];

        drafts.push({
          id: uuidv4(),
          challengeId: challenge.id,
          userId: user.id,
          title: `${template.title} - ${challenge.title}`,
          content: template.content,
          createdAt: subDays(new Date(), Math.floor(Math.random() * 7)), // 최근 7일 내
          updatedAt: new Date(),
        });
        existingDrafts.add(key);
      }
    }
  }

  // 임시 저장 데이터 배치 처리
  const BATCH_SIZE = 1000;
  for (let i = 0; i < drafts.length; i += BATCH_SIZE) {
    const batch = drafts.slice(i, i + BATCH_SIZE);
    await prisma.draftTranslation.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  // 데이터 검증 및 통계
  const totalDrafts = await prisma.draftTranslation.count();
  const challengesWithDrafts = await prisma.challenge.count({
    where: {
      draftTranslations: {
        some: {},
      },
    },
  });

  console.log(
    `✅ 임시 저장 시드 데이터 생성 완료!`,
    `\n총 ${totalDrafts}개의 임시 저장이 생성되었습니다.`,
    `\n${challengesWithDrafts}개의 챌린지에 임시 저장이 있습니다.`,
    `\n평균 임시 저장 수: ${(totalDrafts / challengesWithDrafts).toFixed(1)}개`
  );
};
