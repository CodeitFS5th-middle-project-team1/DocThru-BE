import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const seedDraftTranslations = async (prisma: PrismaClient) => {
  const challenges = await prisma.challenge.findMany();
  const users = await prisma.user.findMany();

  const drafts = [
    {
      title: 'Next.js 라우팅 초안',
      content:
        'This section describes the file-based routing mechanism...\n(추가 번역 예정)',
    },
    {
      title: 'OpenAI API 소개 부분 임시 번역',
      content: 'OpenAI provides access to powerful models...\n아직 정리 안 됨.',
    },
    {
      title: '이력서 가이드 - 개요 초안',
      content: 'Your resume is a marketing tool...\n자연스럽게 다듬을 예정.',
    },
    {
      title: 'Event Loop 개념 정리 중',
      content:
        'The call stack, message queue, and event loop...\n예제 추가 필요.',
    },
    {
      title: '웹 접근성 기초 번역 초안',
      content: 'Accessibility is essential for developers...\n후반 작업 남음.',
    },
    {
      title: 'RESTful API 디자인 초안',
      content:
        'A RESTful API adheres to six architectural constraints...\n용어 정리 필요.',
    },
    {
      title: 'OpenAI 챕터 2 초안',
      content: 'Fine-tuning models allows you to...\n부분 삭제 예정.',
    },
    {
      title: 'Git 워크플로우 초안',
      content: 'Git flow is a branching model for Git...\n개요 위주 초안',
    },
    {
      title: 'GraphQL vs REST 비교 번역 초안',
      content:
        'GraphQL provides a complete and understandable description...\n비교 표 미작성',
    },
    {
      title: 'AI 윤리 가이드 초안',
      content:
        'AI Ethics is about responsible AI development...\n번역 용어 미확정',
    },
    {
      title: '웹 보안 원칙 초안',
      content:
        'Security principles include input validation, authentication...\n정리 필요',
    },
    {
      title: 'React 상태 관리 예시 초안',
      content: 'State can be managed locally or globally...\nRedux 부분은 미완',
    },
    {
      title: 'CSS-in-JS 개념 초안',
      content: 'CSS-in-JS enables styling within JavaScript...\n예제 추가 예정',
    },
    {
      title: 'JWT 인증 흐름 초안',
      content:
        'JSON Web Token (JWT) is a compact and self-contained...\n서명 방식 검토 필요',
    },
    {
      title: 'Node.js 스트림 초안',
      content:
        'Streams are objects that let you read data...\nPipe 예시는 미작성',
    },
    {
      title: 'API 문서화 툴 초안',
      content: 'Tools like Swagger and Postman...\n비교표 번역 누락됨',
    },
    {
      title: '웹 성능 최적화 체크리스트 초안',
      content: 'Performance matters. Here’s how you can improve it...\n미완성',
    },
    {
      title: '기술 면접 팁 정리 초안',
      content: 'Be prepared to explain your past projects...\n예시 추가 필요',
    },
    {
      title: 'OAuth 흐름 번역 초안',
      content:
        'OAuth is an open-standard authorization protocol...\n상세 단계 미작성',
    },
    {
      title: 'PWA 가이드 초안',
      content:
        'Progressive Web Apps use modern web capabilities...\n용어 통일 필요',
    },
  ];

  const draftData = drafts.map((draft, index) => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    return {
      id: uuidv4(),
      challengeId: challenge.id,
      userId: user.id,
      title: draft.title,
      content: draft.content,
      createdAt: subDays(new Date(), Math.floor(Math.random() * 7)),
      updatedAt: new Date(),
    };
  });

  await prisma.draftTranslation.createMany({
    data: draftData,
    skipDuplicates: true,
  });

  console.log(
    `✅ DraftTranslations 시드 완료 (총 ${draftData.length}개 생성됨)`
  );
};
