import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { subDays } from 'date-fns';

export const seedTranslations = async (prisma: PrismaClient) => {
  const challengeIds = [
    'a1e23eaa-1bc2-4b19-a9d2-aaaa11111111', // Next.js
    'b2e23eaa-1bc2-4b19-a9d2-bbbb22222222', // OpenAI
    'c3e23eaa-1bc2-4b19-a9d2-cccc33333333', // Resume
    'd4e23eaa-1bc2-4b19-a9d2-dddd44444444', // Event Loop
    'e5e23eaa-1bc2-4b19-a9d2-eeee55555555', // Accessibility
    'f6e23eaa-1bc2-4b19-a9d2-ffff66666666', // RESTful
  ];

  const userIds = [
    'user-2',
    'user-3',
    'user-4',
    'user-6',
    'user-8',
    'user-9',
    'user-11',
    'user-13',
  ];

  const translations = [
    {
      challengeId: challengeIds[0],
      userId: userIds[0],
      title: 'Next.js 라우팅 문서 번역본',
      content:
        'Next.js의 라우팅은 파일 시스템 기반으로 동작합니다. 사용자는 pages 디렉토리 안에 파일을 생성함으로써 자동으로 라우트를 구성할 수 있습니다.',
    },
    {
      challengeId: challengeIds[1],
      userId: userIds[1],
      title: 'OpenAI API 개요 번역',
      content:
        'OpenAI는 강력한 언어 모델에 대한 접근을 제공합니다. 개발자는 API를 통해 GPT 모델을 활용하여 다양한 자연어 처리 작업을 수행할 수 있습니다.',
    },
    {
      challengeId: challengeIds[2],
      userId: userIds[2],
      title: '구글 개발자 이력서 가이드 번역',
      content:
        '이력서는 자신의 기술과 경력을 마케팅하는 문서입니다. 핵심 기술, 프로젝트, 성과 중심의 표현이 중요합니다.',
    },
    {
      challengeId: challengeIds[3],
      userId: userIds[3],
      title: 'Event Loop 설명 번역',
      content:
        '자바스크립트는 단일 스레드 기반 언어입니다. 이벤트 루프는 비동기 작업을 처리하기 위해 콜백 큐와 콜스택을 이용합니다.',
    },
    {
      challengeId: challengeIds[4],
      userId: userIds[4],
      title: '웹 접근성 기본 가이드 번역',
      content:
        '접근성은 장애 유무에 관계없이 모두가 웹을 이용할 수 있도록 만드는 것입니다. 명확한 레이블과 키보드 내비게이션 지원이 필요합니다.',
    },
    {
      challengeId: challengeIds[5],
      userId: userIds[5],
      title: 'RESTful API 디자인 원칙 번역',
      content:
        'REST는 자원을 URI로 식별하고, HTTP 메서드를 통해 해당 자원에 대한 행위를 정의합니다. 상태 비저장성과 계층 구조도 중요한 원칙입니다.',
    },
    {
      challengeId: challengeIds[0],
      userId: userIds[6],
      title: 'Next.js 고급 라우팅 파트 번역',
      content:
        '중첩 라우팅은 레이아웃을 재사용하면서 페이지를 구성하는 방식입니다. layout.tsx를 활용하면 공통 UI를 쉽게 구성할 수 있습니다.',
    },
  ];

  await prisma.translation.createMany({
    data: translations.map((t) => ({
      id: uuidv4(),
      ...t,
      likeCount: Math.floor(Math.random() * 50),
      createdAt: subDays(new Date(), Math.floor(Math.random() * 10)),
      updatedAt: new Date(),
    })),
  });

  console.log('✅ Translations 시드 완료 (제출된 번역물 7개)');
};
