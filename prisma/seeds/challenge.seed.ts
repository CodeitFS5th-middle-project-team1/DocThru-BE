import {
  PrismaClient,
  DocumentType,
  FieldType,
  ApprovalStatus,
} from '@prisma/client';

// 실제 같은 챌린지 제목 생성
const generateTitle = (index: number, field: FieldType) => {
  const nextjsTitles = [
    'Next.js 13의 새로운 App Router 활용 가이드',
    'Next.js에서 서버 컴포넌트 최적화하기',
    'Next.js와 Vercel을 이용한 CI/CD 구축',
    'Next.js의 SSR, SSG, ISR 전략 비교',
    'Next.js API Routes로 서버리스 API 구축하기',
    'Next.js 프로젝트에 Tailwind CSS 적용하기',
    'Next.js와 모노레포 전략',
    'Next.js의 미들웨어를 활용한 인증 시스템',
    'Next.js에서 국제화(i18n) 구현하기',
    'Next.js와 GraphQL 통합하기',
  ];

  const modernjsTitles = [
    'ES2022 주요 기능 살펴보기',
    'JavaScript의 최신 비동기 패턴',
    'TypeScript 5.0 새로운 기능 정리',
    '모던 JavaScript 모듈 시스템 이해하기',
    'JavaScript의 Proxy와 Reflect API 활용',
    '함수형 프로그래밍과 JavaScript',
    'JavaScript의 메모리 관리와 가비지 컬렉션',
    'JavaScript 디자인 패턴 구현하기',
    'Web Workers를 이용한 멀티스레딩',
    'JavaScript의 최신 성능 최적화 기법',
  ];

  const apiTitles = [
    'RESTful API 설계 원칙과 모범 사례',
    'GraphQL API 구축 가이드',
    'API 게이트웨이 패턴 구현하기',
    'OpenAPI Specification으로 API 문서화하기',
    'API 보안: OAuth 2.0과 JWT 활용',
    'gRPC API 소개 및 구현 방법',
    'API 버전 관리 전략',
    'API 캐싱 최적화 기법',
    'API 테스팅과 모니터링 방법론',
    'Webhook을 이용한 실시간 API 알림 구현',
  ];

  const webTitles = [
    'WebAssembly 시작하기',
    'Progressive Web Apps 개발 가이드',
    'Web3와 분산형 웹 애플리케이션',
    'Service Workers 활용 실전 예제',
    'WebRTC를 이용한 화상 채팅 구현',
    '웹 성능 최적화 기법 총정리',
    'CSS Grid와 Flexbox 레이아웃 전략',
    'Web Components 개발 실무',
    'Micro Frontends 아키텍처 구현',
    'WebGL을 이용한 3D 그래픽 구현',
  ];

  const careerTitles = [
    '개발자 이력서 작성 가이드',
    '기술 면접 준비 전략',
    '개발자 포트폴리오 구성 방법',
    '오픈 소스 프로젝트 기여하는 방법',
    '개발자 커리어 로드맵',
    '테크 리더로 성장하는 방법',
    '개발자 영어 역량 키우기',
    '개발자 네트워킹과 커뮤니티 활동',
    '재택/원격 근무 개발자 생산성 향상법',
    '개발자 번아웃 관리와 멘탈 헬스',
  ];

  let titles: string[] = [];

  switch (field) {
    case FieldType.NEXTJS:
      titles = nextjsTitles;
      break;
    case FieldType.MODERNJS:
      titles = modernjsTitles;
      break;
    case FieldType.API:
      titles = apiTitles;
      break;
    case FieldType.WEB:
      titles = webTitles;
      break;
    case FieldType.CAREER:
      titles = careerTitles;
      break;
  }

  return titles[index % titles.length];
};

// 실제 같은 URL 생성
const generateOriginURL = (field: FieldType, title: string) => {
  const slugTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const domains = {
    [FieldType.NEXTJS]: 'nextjs.org',
    [FieldType.MODERNJS]: 'javascript.info',
    [FieldType.API]: 'api-university.com',
    [FieldType.WEB]: 'web.dev',
    [FieldType.CAREER]: 'devcareer.io',
  };

  return `https://${domains[field]}/blog/${slugTitle}`;
};

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateChallenge = async (
  prisma: PrismaClient,
  userId: string,
  index: number
) => {
  const today = new Date();
  const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  const deadline = generateRandomDate(oneWeekLater, twoWeeksLater);
  const maxParticipants = Math.floor(Math.random() * 5) + 1;
  const currentParticipants = 0;

  // 상태 분포 조정: APPROVED 60%, PENDING 20%, REJECTED 10%, DELETED 10%
  const random = Math.random();
  let approvalStatus;
  if (random < 0.6) {
    approvalStatus = ApprovalStatus.APPROVED;
  } else if (random < 0.8) {
    approvalStatus = ApprovalStatus.PENDING;
  } else if (random < 0.9) {
    approvalStatus = ApprovalStatus.REJECTED;
  } else {
    approvalStatus = ApprovalStatus.DELETED;
  }

  // 생성 시간은 최근 30일 이내로 설정
  const createdAt = new Date(
    today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
  );

  const field =
    Object.values(FieldType)[
      Math.floor(Math.random() * Object.values(FieldType).length)
    ];

  const title = generateTitle(index, field);
  const originURL = generateOriginURL(field, title);

  const challenge = {
    idx: index + 1, // idx는 1부터 시작
    field,
    userId,
    title,
    originURL,
    documentType:
      Math.random() > 0.5 ? DocumentType.BLOG : DocumentType.OFFICIAL,
    deadline,
    maxParticipants,
    currentParticipants,
    description: `${title}에 대한 번역 챌린지입니다. 이 문서는 ${field} 분야의 유용한 정보를 담고 있습니다.`,
    approvalStatus,
    isParticipantsFull:
      approvalStatus === ApprovalStatus.APPROVED
        ? currentParticipants >= maxParticipants
        : false,
    isDeadlineFull: false,
    createdAt,
  };

  // approvalAt, rejectedAt, deletedAt은 모두 createdAt보다 미래여야 함
  if (approvalStatus === ApprovalStatus.APPROVED) {
    // 생성 시간 이후, 오늘 이전의 랜덤한 시간
    const approvalAt = new Date(
      createdAt.getTime() +
        Math.random() * (today.getTime() - createdAt.getTime())
    );

    return {
      ...challenge,
      approvalAt,
      isParticipantsFull: currentParticipants >= maxParticipants,
      isDeadlineFull: Math.random() > 0.7,
    };
  }

  if (approvalStatus === ApprovalStatus.REJECTED) {
    // 생성 시간 이후, 오늘 이전의 랜덤한 시간
    const rejectedAt = new Date(
      createdAt.getTime() +
        Math.random() * (today.getTime() - createdAt.getTime())
    );

    const rejectionReasons = [
      '제공된 URL이 유효하지 않습니다.',
      '유사한 챌린지가 이미 존재합니다.',
      '콘텐츠가 가이드라인에 부합하지 않습니다.',
      '저작권 문제의 우려가 있습니다.',
      '문서의 길이가 너무 짧거나 깁니다.',
      '문서의 주제가 플랫폼의 범위를 벗어납니다.',
    ];

    return {
      ...challenge,
      rejectedAt,
      rejectedReason:
        rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)],
    };
  }

  if (approvalStatus === ApprovalStatus.DELETED) {
    // 생성 시간 이후, 오늘 이전의 랜덤한 시간
    const deletedAt = new Date(
      createdAt.getTime() +
        Math.random() * (today.getTime() - createdAt.getTime())
    );

    const deletionReasons = [
      '작성자에 의해 삭제 요청됨',
      '원본 콘텐츠가 더 이상 사용 불가능함',
      '중복된 챌린지로 판단됨',
      '운영 정책 위반',
      '낮은 참여도',
      '기술적 오류 발생',
    ];

    return {
      ...challenge,
      deletedAt,
      deletedReason:
        deletionReasons[Math.floor(Math.random() * deletionReasons.length)],
    };
  }

  // PENDING 상태인 경우 추가 필드 없음
  return challenge;
};

export const seedAllChallenges = async (prisma: PrismaClient) => {
  // 모든 유저 ID 가져오기
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    throw new Error('시드할 유저가 없습니다.');
  }

  console.log('🏆 Challenges 생성 중...');

  const challenges = await Promise.all(
    // 300개의 챌린지 생성
    Array(300)
      .fill(null)
      .map((_, index) => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        return generateChallenge(prisma, randomUser.id, index);
      })
  );

  await prisma.challenge.createMany({
    data: challenges,
    skipDuplicates: true,
  });

  console.log(`✅ Challenges ${challenges.length}개 생성 완료!`);
};
