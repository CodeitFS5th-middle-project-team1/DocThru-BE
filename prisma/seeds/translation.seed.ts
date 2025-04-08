import { PrismaClient } from '@prisma/client';
import { subDays } from 'date-fns';

// 기술 문서 내용 생성 함수
const generateTechContent = (title: string, field: string) => {
  const introductions = [
    '이 문서에서는 ${field}의 핵심 개념과 실제 구현 방법에 대해 자세히 알아보겠습니다.',
    '${field}를 효과적으로 활용하기 위한 심층적인 가이드를 제공합니다.',
    '${field}의 최신 트렌드와 실무 적용 방법을 상세히 설명합니다.',
  ];

  const mainContents = {
    NEXTJS: [
      `# Next.js의 핵심 기능

## 1. 서버 사이드 렌더링 (SSR)
Next.js의 가장 큰 특징은 서버 사이드 렌더링을 쉽게 구현할 수 있다는 점입니다. SSR은 초기 페이지 로딩 속도를 개선하고 SEO를 향상시키는 데 매우 효과적입니다.

\`\`\`typescript
// pages/index.tsx
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  
  return {
    props: { data }
  };
}
\`\`\`

## 2. 정적 사이트 생성 (SSG)
빌드 시점에 페이지를 생성하여 CDN에서 제공할 수 있습니다. 이는 블로그나 마케팅 페이지에 특히 유용합니다.

## 3. 파일 기반 라우팅
pages 디렉토리 내의 파일 구조가 곧 라우팅 구조가 되는 직관적인 시스템을 제공합니다.

## 4. API 라우트
별도의 서버 없이도 API 엔드포인트를 쉽게 생성할 수 있습니다.

## 5. 최적화 기능
- 자동 이미지 최적화
- 폰트 최적화
- 스크립트 최적화

## 실제 프로젝트 적용 예시
\`\`\`typescript
// components/Layout.tsx
import Head from 'next/head';
import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Modern web application" />
      </Head>
      <Navigation />
      <main>{children}</main>
    </>
  );
}
\`\`\``,
    ],
    MODERNJS: [
      `# 모던 자바스크립트의 핵심 기능

## 1. 비동기 프로그래밍
async/await를 사용한 우아한 비동기 처리:

\`\`\`javascript
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}
\`\`\`

## 2. 모듈 시스템
ES Modules를 사용한 코드 구조화:

\`\`\`javascript
// utils.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('ko-KR').format(date);
};

// main.js
import { formatDate } from './utils.js';
\`\`\`

## 3. 새로운 데이터 구조
Map과 Set을 활용한 데이터 관리:

\`\`\`javascript
const userRoles = new Map();
userRoles.set('admin', ['read', 'write', 'delete']);
userRoles.set('user', ['read']);

const uniqueTags = new Set(['javascript', 'typescript', 'react']);
\`\`\`

## 4. 프로토타입과 클래스
클래스 기반 객체 지향 프로그래밍:

\`\`\`javascript
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUser(id) {
    return this.apiClient.get(\`/users/\${id}\`);
  }
}
\`\`\``,
    ],
    API: [
      `# RESTful API 설계 가이드

## 1. API 엔드포인트 설계 원칙
- 리소스는 명사로 표현
- HTTP 메서드를 올바르게 사용
- 계층 구조는 URL에 반영

\`\`\`javascript
// 좋은 예시
GET /articles
POST /articles
GET /articles/:id
PUT /articles/:id
DELETE /articles/:id

// 나쁜 예시
GET /getArticles
POST /createArticle
\`\`\`

## 2. 상태 코드 활용
적절한 HTTP 상태 코드 사용:
- 200: 성공
- 201: 생성됨
- 400: 잘못된 요청
- 401: 인증 필요
- 403: 권한 없음
- 404: 찾을 수 없음
- 500: 서버 오류

## 3. 인증과 보안
JWT를 활용한 인증 구현:

\`\`\`javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
\`\`\`

## 4. 에러 처리
일관된 에러 응답 형식:

\`\`\`javascript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
\`\`\``,
    ],
  };

  const conclusions = [
    '이러한 기능들을 적절히 활용하면 더 효율적이고 유지보수가 쉬운 애플리케이션을 개발할 수 있습니다.',
    '위 내용들을 실제 프로젝트에 적용하면서 점진적으로 발전시켜 나가시기 바랍니다.',
    '이 가이드가 여러분의 개발 여정에 도움이 되길 바랍니다.',
  ];

  const introduction = introductions[
    Math.floor(Math.random() * introductions.length)
  ].replace('${field}', field);

  const mainContent =
    mainContents[field as keyof typeof mainContents]?.[0] ||
    '이 문서의 자세한 내용은 현재 준비 중입니다. 곧 업데이트하도록 하겠습니다.';

  const conclusion =
    conclusions[Math.floor(Math.random() * conclusions.length)];

  return `${introduction}\n\n${mainContent}\n\n${conclusion}`;
};

export const seedTranslations = async (prisma: PrismaClient) => {
  console.log('💬 번역 시드 데이터 생성 중...');
  // 승인된 챌린지와 그 참가자들 조회
  const challengeParticipants = await prisma.challengeParticipant.findMany({
    include: {
      challenge: {
        select: {
          id: true,
          title: true,
          field: true,
          currentParticipants: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const translations = [];

  // 각 챌린지 참가자별로 번역물 생성
  for (const participant of challengeParticipants) {
    const { challenge, user } = participant;

    // 랜덤한 생성 날짜 (최근 30일 이내)
    const createdAt = subDays(new Date(), Math.floor(Math.random() * 30));

    translations.push({
      challengeId: challenge.id,
      userId: user.id,
      title: challenge.title,
      content: generateTechContent(challenge.title, challenge.field),
      likeCount: 0,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // 번역물 데이터 생성
  await prisma.translation.createMany({
    data: translations,
    skipDuplicates: true,
  });

  console.log(`✅ ${translations.length}개의 번역물 생성 완료!`);

  return translations;
};
