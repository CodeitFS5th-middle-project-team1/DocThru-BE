import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const seedDraftTranslations = async (prisma: PrismaClient) => {
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
    'user-13',
    'user-14',
    'user-15',
  ];

  const drafts = [
    {
      challengeId: challengeIds[0],
      userId: userIds[0],
      title: 'Next.js 라우팅 초안',
      content:
        'This section describes the file-based routing mechanism...\n(추가 번역 예정)',
    },
    {
      challengeId: challengeIds[1],
      userId: userIds[2],
      title: 'OpenAI API 소개 부분 임시 번역',
      content: 'OpenAI provides access to powerful models...\n아직 정리 안 됨.',
    },
    {
      challengeId: challengeIds[2],
      userId: userIds[4],
      title: '이력서 가이드 - 개요 초안',
      content: 'Your resume is a marketing tool...\n자연스럽게 다듬을 예정.',
    },
    {
      challengeId: challengeIds[3],
      userId: userIds[6],
      title: 'Event Loop 개념 정리 중',
      content:
        'The call stack, message queue, and event loop...\n예제 추가 필요.',
    },
    {
      challengeId: challengeIds[4],
      userId: userIds[8],
      title: '웹 접근성 기초 번역 초안',
      content: 'Accessibility is essential for developers...\n후반 작업 남음.',
    },
    {
      challengeId: challengeIds[5],
      userId: userIds[10],
      title: 'RESTful API 디자인 초안',
      content:
        'A RESTful API adheres to six architectural constraints...\n용어 정리 필요.',
    },
    {
      challengeId: challengeIds[1],
      userId: userIds[1],
      title: 'OpenAI 챕터 2 초안',
      content: 'Fine-tuning models allows you to...\n부분 삭제 예정.',
    },
  ];

  await prisma.draftTranslation.createMany({
    data: drafts.map((draft) => ({
      id: uuidv4(),
      ...draft,
      createdAt: subDays(new Date(), Math.floor(Math.random() * 7)), // 최근 일주일 내 작성
      updatedAt: new Date(),
    })),
  });

  console.log('✅ DraftTranslations 시드 완료 (총 7개)');
};
