import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { subDays } from 'date-fns';

export const seedTranslations = async (prisma: PrismaClient) => {
  const challenges = await prisma.challenge.findMany();
  const users = await prisma.user.findMany();

  const sampleTranslations = [
    {
      title: 'Next.js 서버 구성 번역',
      content:
        '이 문서에서는 Next.js의 서버 환경 설정과 구성 요소에 대해 설명합니다...',
    },
    {
      title: 'OpenAI 튜토리얼 번역',
      content:
        'OpenAI 튜토리얼에서는 모델 호출, 입력 구성 등 기본 사용법을 다룹니다...',
    },
    {
      title: '포트폴리오 작성법 정리',
      content:
        '포트폴리오 작성 시 프로젝트 중심으로 구성하는 것이 효과적입니다...',
    },
    {
      title: '비동기 처리 흐름 번역',
      content:
        '비동기 처리의 흐름은 이벤트 루프와 함께 콜백 큐로 이어집니다...',
    },
    {
      title: '스크린리더 접근성 가이드',
      content:
        '스크린리더는 요소의 접근성을 기준으로 동작하므로 aria 속성이 중요합니다...',
    },
    {
      title: 'API 인증 방식 설명',
      content:
        'API 인증에는 토큰 기반 인증, 세션 기반 인증 등이 있으며 보안이 중요합니다...',
    },
    {
      title: 'Next.js 미들웨어 파트',
      content:
        '미들웨어는 라우트 처리 전 데이터를 가공하거나 인증을 처리하는 데 사용됩니다...',
    },
    {
      title: 'GPT 활용 예제 번역',
      content:
        'GPT는 prompt를 기반으로 응답을 생성하며 다양한 파라미터 조정이 가능합니다...',
    },
    {
      title: '이력서 항목별 작성법',
      content:
        '항목별로 역할, 성과, 사용 기술을 명확하게 기술하는 것이 중요합니다...',
    },
    {
      title: 'REST 구조 요약 번역',
      content:
        'REST는 GET, POST, PUT, DELETE 메서드를 통해 CRUD를 수행합니다...',
    },
    {
      title: '웹 보안 기본 원칙 번역',
      content:
        '웹 보안을 위한 기본 원칙에는 입력 검증, 인증, 권한 부여가 포함됩니다...',
    },
    {
      title: 'GraphQL 쿼리 구조 설명',
      content:
        'GraphQL에서는 원하는 데이터를 정확하게 요청하고, 중첩 쿼리를 처리할 수 있습니다...',
    },
    {
      title: '자바스크립트 클로저 개념 번역',
      content:
        '클로저는 함수가 생성될 때의 렉시컬 환경을 기억하는 함수입니다...',
    },
    {
      title: '브라우저 렌더링 과정 정리',
      content:
        '렌더링 과정은 HTML 파싱 → DOM 트리 생성 → CSSOM → 렌더 트리 → 페인트 → 컴포지팅...',
    },
    {
      title: 'Git Rebase vs Merge 번역',
      content:
        'Git에서 rebase는 깔끔한 커밋 히스토리를 제공하며, merge는 히스토리를 보존합니다...',
    },
    {
      title: 'React 훅 개요 번역',
      content:
        'React 훅은 함수형 컴포넌트에서 상태 및 생명주기 기능을 사용할 수 있게 해줍니다...',
    },
    {
      title: '프로그레시브 웹앱(PWA) 기초',
      content:
        'PWA는 오프라인 기능, 홈화면 설치, 빠른 로딩을 제공하는 최신 웹 기술입니다...',
    },
    {
      title: 'CI/CD 파이프라인 개요 번역',
      content:
        'CI/CD는 자동화된 테스트와 배포를 통해 빠르고 안정적인 배포 프로세스를 지원합니다...',
    },
    {
      title: 'Webpack 설정 가이드',
      content:
        'Webpack은 모듈 번들러로 entry, output, loaders, plugins 등으로 구성됩니다...',
    },
    {
      title: '테크 블로그 작성법 요약',
      content:
        '테크 블로그는 주제를 명확히 하고, 예제와 실전 적용 경험을 중심으로 작성해야 합니다...',
    },
    // 추가 번역 데이터
    {
      title: 'Next.js 앱 라우터 개념 설명',
      content:
        'Next.js 앱 라우터는 페이지 기반 라우팅을 넘어 더 유연한 라우팅 시스템을 제공합니다...',
    },
    {
      title: 'React Server Components 소개',
      content:
        'React Server Components는 서버에서 렌더링되어 클라이언트로 스트리밍되는 새로운 컴포넌트 유형입니다...',
    },
    {
      title: 'TypeScript 고급 타입 활용법',
      content:
        'TypeScript의 고급 타입인 제네릭, 유틸리티 타입, 조건부 타입을 활용하면 더 견고한 코드를 작성할 수 있습니다...',
    },
    {
      title: 'GraphQL vs REST API 비교',
      content:
        'GraphQL은 단일 엔드포인트와 정확한 데이터 요청이 가능한 반면, REST는 다중 엔드포인트 구조를 가집니다...',
    },
    {
      title: '마이크로서비스 아키텍처 이해하기',
      content:
        '마이크로서비스는 작은 독립적 서비스로 큰 애플리케이션을 구성하는 아키텍처 스타일입니다...',
    },
    {
      title: 'OAuth 2.0 인증 흐름 정리',
      content:
        'OAuth 2.0은 클라이언트, 리소스 소유자, 권한 서버 간의 인증 흐름을 통해 안전한 액세스를 제공합니다...',
    },
    {
      title: 'Docker 컨테이너 기초 개념',
      content:
        'Docker는 애플리케이션을 컨테이너로 패키징하여 환경에 상관없이 일관되게 실행할 수 있도록 합니다...',
    },
    {
      title: 'CSS Grid 레이아웃 마스터하기',
      content:
        'CSS Grid는 2차원 레이아웃 시스템으로 복잡한 디자인을 쉽게 구현할 수 있게 해줍니다...',
    },
    {
      title: '자바스크립트 비동기 패턴 비교',
      content:
        '콜백, 프로미스, async/await 등 자바스크립트의 다양한 비동기 패턴을 목적에 맞게 활용해야 합니다...',
    },
    {
      title: 'Node.js 스트림 API 활용법',
      content:
        'Node.js 스트림은 데이터를 청크 단위로 처리하여 메모리 효율성을 높이는 방법을 제공합니다...',
    },
    {
      title: 'Redis 캐싱 전략 구현하기',
      content:
        'Redis를 활용한 캐싱은 자주 요청되는 데이터의 접근 속도를 크게 향상시킵니다...',
    },
    {
      title: '웹 성능 최적화 체크리스트',
      content:
        '이미지 최적화, 코드 분할, 지연 로딩, 캐싱 전략은 웹 성능 향상의 핵심 요소입니다...',
    },
    {
      title: 'JWT 인증 시스템 구현 방법',
      content:
        'JWT는 헤더, 페이로드, 서명으로 구성된 토큰으로 안전하게 사용자 정보를 전달합니다...',
    },
    {
      title: 'Serverless 아키텍처 이해하기',
      content:
        '서버리스 아키텍처는 인프라 관리 없이 애플리케이션 코드에만 집중할 수 있게 해줍니다...',
    },
    {
      title: 'WebAssembly 기초 개념 정리',
      content:
        'WebAssembly는 브라우저에서 네이티브에 가까운 성능으로 코드를 실행할 수 있게 해주는 기술입니다...',
    },
    {
      title: 'GitHub Actions로 CI/CD 구축하기',
      content:
        'GitHub Actions를 통해 코드 푸시부터 빌드, 테스트, 배포까지 자동화 파이프라인을 구축할 수 있습니다...',
    },
    {
      title: 'Kubernetes 기본 개념 정리',
      content:
        'Kubernetes는 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화하는 플랫폼입니다...',
    },
    {
      title: '함수형 프로그래밍 원리 번역',
      content:
        '함수형 프로그래밍은 순수 함수, 불변성, 고차 함수, 합성 등의 원칙을 중심으로 합니다...',
    },
    {
      title: 'RxJS 반응형 프로그래밍 소개',
      content:
        'RxJS는 비동기 및 이벤트 기반 프로그램을 Observable 시퀀스를 사용하여 구성하는 라이브러리입니다...',
    },
  ];

  // 더 많은 번역 데이터를 생성하기 위한 준비
  const allTranslations = [];

  // 기존 번역 데이터 생성 - likeCount를 0으로 초기화
  const firstBatchTranslations = sampleTranslations.map((t, index) => ({
    id: uuidv4(),
    challengeId: challenges[index % challenges.length].id,
    userId: users[index % users.length].id,
    title: t.title,
    content: t.content,
    likeCount: 0, // 초기값 0으로 설정
    createdAt: subDays(new Date(), Math.floor(Math.random() * 7)),
    updatedAt: new Date(),
  }));

  allTranslations.push(...firstBatchTranslations);

  // 추가 번역 데이터 생성 (각 챌린지에 더 많은 번역 추가)
  for (let i = 0; i < challenges.length; i++) {
    const challenge = challenges[i];
    // 각 챌린지마다 2-5개의 추가 번역 생성
    const numExtraTranslations = Math.floor(Math.random() * 4) + 2;

    for (let j = 0; j < numExtraTranslations; j++) {
      // 랜덤하게 사용자와 번역 컨텐츠 선택
      const randomTranslation =
        sampleTranslations[
          Math.floor(Math.random() * sampleTranslations.length)
        ];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // 약간의 변형을 주기 위해 타이틀에 접미사 추가
      const titleVariations = [
        '상세 분석',
        '심층 해설',
        '기본 정리',
        '응용 가이드',
        '입문 번역',
      ];
      const titleSuffix =
        titleVariations[Math.floor(Math.random() * titleVariations.length)];

      allTranslations.push({
        id: uuidv4(),
        challengeId: challenge.id,
        userId: randomUser.id,
        title: `${randomTranslation.title} - ${titleSuffix}`,
        content: `${randomTranslation.content} 추가적인 설명과 예시를 포함합니다...`,
        likeCount: 0, // 초기값 0으로 설정
        createdAt: subDays(new Date(), Math.floor(Math.random() * 7)),
        updatedAt: new Date(),
      });
    }
  }

  await prisma.translation.createMany({
    data: allTranslations,
    skipDuplicates: true,
  });

  console.log(`✅ Translations 시드 완료 (${allTranslations.length}개)`);
};
