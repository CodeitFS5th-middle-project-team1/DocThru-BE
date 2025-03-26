import { PrismaClient, DocumentType, FieldType } from '@prisma/client';
import { subDays, addDays } from 'date-fns';

export const seedChallenges = async (prisma: PrismaClient) => {
  await prisma.challenge.createMany({
    data: [
      {
        id: 'a1e23eaa-1bc2-4b19-a9d2-aaaa11111111',
        field: FieldType.NEXTJS,
        userId: 'user-1',
        title: 'Next.js 14 App Router 문서 번역',
        originURL:
          'https://nextjs.org/docs/app/building-your-application/routing',
        documentType: DocumentType.Blog,
        deadline: addDays(new Date(), 10),
        maxParticipants: 5,
        currentParticipants: 1,
        description: 'Next.js 14의 App Router 공식 문서를 함께 번역해요!',
        content:
          '번역 규칙: 공식 용어는 유지, 예제 코드는 그대로, 번역은 자연스럽게.',
        createdAt: subDays(new Date(), 2),
        updatedAt: new Date(),
      },
      {
        id: 'b2e23eaa-1bc2-4b19-a9d2-bbbb22222222',
        field: FieldType.API,
        userId: 'user-2',
        title: 'OpenAI API 가이드 한글화',
        originURL: 'https://platform.openai.com/docs/guides/gpt',
        documentType: DocumentType.OFFICIAL,
        deadline: addDays(new Date(), 7),
        maxParticipants: 3,
        currentParticipants: 2,
        description: 'OpenAI GPT 가이드를 한국어로 번역하는 챌린지입니다.',
        content: '용어집에 따라 정리하고, 예시는 생략하지 말아주세요.',
        createdAt: subDays(new Date(), 5),
        updatedAt: new Date(),
      },
      {
        id: 'c3e23eaa-1bc2-4b19-a9d2-cccc33333333',
        field: FieldType.CAREER,
        userId: 'user-3',
        title: '개발자 이력서 작성 공식 가이드 번역',
        originURL: 'https://developers.google.com/tech-resume',
        documentType: DocumentType.OFFICIAL,
        deadline: addDays(new Date(), 14),
        maxParticipants: 4,
        currentParticipants: 0,
        description: '구글 공식 개발자 이력서 가이드를 함께 번역해요.',
        content:
          '내용의 맥락을 유지하고, 문법/형식은 자유롭게 조정해도 좋아요.',
        createdAt: subDays(new Date(), 1),
        updatedAt: new Date(),
      },
      {
        id: 'd4e23eaa-1bc2-4b19-a9d2-dddd44444444',
        field: FieldType.MODERNJS,
        userId: 'user-4',
        title: 'JavaScript Event Loop 완전 정복 블로그 번역',
        originURL:
          'https://blog.bitsrc.io/understanding-the-event-loop-cf1c807dcd89',
        documentType: DocumentType.Blog,
        deadline: addDays(new Date(), 5),
        maxParticipants: 4,
        currentParticipants: 2,
        description:
          '비동기 처리와 Event Loop 개념을 이해하기 위한 블로그 번역 챌린지입니다.',
        content:
          '실제 예시 코드 위주로 번역하고, 설명은 최대한 자연스럽게 풀어주세요.',
        createdAt: subDays(new Date(), 3),
        updatedAt: new Date(),
      },
      {
        id: 'e5e23eaa-1bc2-4b19-a9d2-eeee55555555',
        field: FieldType.WEB,
        userId: 'user-5',
        title: '웹 접근성 (a11y) 공식 가이드 번역',
        originURL: 'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
        documentType: DocumentType.OFFICIAL,
        deadline: addDays(new Date(), 12),
        maxParticipants: 6,
        currentParticipants: 4,
        description:
          'W3C에서 제공하는 웹 접근성 기본 가이드를 함께 번역하는 챌린지입니다.',
        content: '용어집을 참고하며 일관성 있게 번역해주세요.',
        createdAt: subDays(new Date(), 4),
        updatedAt: new Date(),
      },
      {
        id: 'f6e23eaa-1bc2-4b19-a9d2-ffff66666666',
        field: FieldType.API,
        userId: 'user-6',
        title: 'RESTful API 디자인 원칙 번역 챌린지',
        originURL: 'https://restfulapi.net/rest-architectural-constraints/',
        documentType: DocumentType.Blog,
        deadline: addDays(new Date(), 9),
        maxParticipants: 3,
        currentParticipants: 1,
        description:
          'REST API 디자인에 대한 아티클을 번역하고 개념을 정리하는 챌린지입니다.',
        content:
          '중요 개념은 부연 설명을 추가하고, 예시는 가능한 한 직역으로 처리해주세요.',
        createdAt: subDays(new Date(), 2),
        updatedAt: new Date(),
      },
    ],
  });

  console.log('✅ Challenges seeded');
};
