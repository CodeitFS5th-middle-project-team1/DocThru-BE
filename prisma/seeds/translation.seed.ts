import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { subDays } from 'date-fns';

export const seedTranslations = async (
  prisma:
    | PrismaClient
    | Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >
) => {
  const challenges = await prisma.challenge.findMany();
  const users = await prisma.user.findMany();
  const titlesAndContents = [
    {
      title: 'Vue.js 3.x의 Composition API 소개',
      content:
        'Vue.js의 새로운 Composition API를 통해 기능별로 코드를 구성하는 방법에 대해 배울 수 있습니다. 이 API는 반응형 시스템을 더 깔끔하게 관리할 수 있게 해줍니다.',
    },
    {
      title: 'Python에서의 동시성 처리 방법',
      content:
        'Python의 asyncio 라이브러리와 multi-threading을 사용하여 I/O와 CPU 바운드 작업을 처리하는 방법을 배웁니다.',
    },
    {
      title: '컨테이너 오케스트레이션 이해: Kubernetes 기초',
      content:
        '컨테이너화된 애플리케이션을 관리하는 Kubernetes의 기본 구성 요소와 아키텍처를 탐구합니다.',
    },
    {
      title: '효과적인 RESTful API 디자인 원칙',
      content:
        'RESTful API를 설계할 때 고려해야 할 주요 원칙과 최선의 실천 방법을 살펴봅니다.',
    },
    {
      title: '모던 JavaScript: ES2021의 새로운 기능들',
      content:
        '최신 JavaScript 표준인 ES2021에서 추가된 기능들과 그 사용법에 대해 설명합니다.',
    },
    {
      title: 'React와 TypeScript를 사용한 프론트엔드 개발',
      content:
        'TypeScript를 사용하여 React 애플리케이션을 더 안정적이고 관리하기 쉽게 만드는 방법을 배웁니다.',
    },
    {
      title: 'AWS 클라우드 서비스의 기초',
      content:
        'AWS에서 제공하는 다양한 클라우드 서비스와 기본 개념을 소개하며, 각 서비스의 용도와 사용법을 다룹니다.',
    },
    {
      title: '애자일 개발 방법론과 스크럼 기법',
      content:
        '소프트웨어 개발에서 애자일과 스크럼 방법론이 어떻게 적용되는지, 그리고 팀과 프로젝트 관리에 미치는 영향에 대해 알아봅니다.',
    },
    {
      title: 'Node.js를 이용한 백엔드 프로그래밍',
      content:
        'Node.js의 기본적인 사용법부터 API 개발, 데이터베이스 연동 방법까지 살펴봅니다.',
    },
    {
      title: '블록체인 기술의 이해와 애플리케이션',
      content:
        '블록체인 기술이 무엇인지, 그리고 다양한 산업 분야에서 어떻게 활용되고 있는지에 대한 개요를 제공합니다.',
    },
    {
      title: '실시간 웹 애플리케이션 개발을 위한 Socket.IO 소개',
      content:
        '이 문서는 실시간 웹 애플리케이션 개발에 널리 사용되는 Socket.IO 라이브러리에 대해 설명하며, 기본적인 사용법과 함께 실제 예제를 다룹니다.',
    },
    {
      title: 'Angular 프레임워크를 사용한 SPA 개발 가이드',
      content:
        'Angular를 사용하여 단일 페이지 애플리케이션(SPA)을 개발하는 방법을 자세히 설명하며, 컴포넌트 기반 아키텍처를 중심으로 설명합니다.',
    },
    {
      title: '데이터 과학과 머신러닝 파이프라인 구축',
      content:
        '데이터 수집부터 처리, 모델링, 예측에 이르기까지의 전체 머신러닝 파이프라인 구축 과정을 설명합니다.',
    },
    {
      title: 'DevOps 문화 구축을 위한 주요 전략과 도구',
      content:
        '효과적인 DevOps 문화를 구축하는 방법과 이를 지원하는 현대의 도구들에 대해 소개합니다.',
    },
    {
      title: '클라우드 네이티브 애플리케이션 설계의 이해',
      content:
        '클라우드 네이티브 애플리케이션의 핵심 원리와 이를 설계하는 방법에 대해 자세히 설명합니다.',
    },
    {
      title: '자바스크립트 메모리 관리와 가비지 컬렉션',
      content:
        '자바스크립트에서 메모리 관리가 어떻게 이루어지는지, 가비지 컬렉션의 원리와 최적화 방법을 탐구합니다.',
    },
    {
      title: '안드로이드 앱 개발의 최신 트렌드와 기술',
      content:
        '안드로이드 애플리케이션 개발에 사용되는 최신 도구와 프레임워크, 그리고 현재 트렌드에 대해 설명합니다.',
    },
    {
      title: 'iOS 앱 개발을 위한 Swift의 고급 기능',
      content:
        'Swift 프로그래밍 언어의 고급 기능들을 사용하여 iOS 애플리케이션을 더 효과적으로 개발하는 방법을 배웁니다.',
    },
    {
      title: 'SOLID 원칙을 적용한 객체 지향 설계',
      content:
        '객체 지향 프로그래밍의 SOLID 원칙을 적용하는 방법과 이를 통해 얻을 수 있는 설계 개선 사항에 대해 설명합니다.',
    },
    {
      title: '크로스 플랫폼 개발 프레임워크 비교: React Native vs Flutter',
      content:
        'React Native와 Flutter, 두 크로스 플랫폼 개발 프레임워크의 장단점을 비교하고 각각의 사용 사례에 대해 설명합니다.',
    },
    {
      title: 'Vue.js 3.x의 Composition API 소개',
      content:
        'Vue.js의 새로운 Composition API를 통해 기능별로 코드를 구성하는 방법에 대해 배울 수 있습니다. 이 API는 반응형 시스템을 더 깔끔하게 관리할 수 있게 해줍니다.',
    },
    {
      title: 'Python에서의 동시성 처리 방법',
      content:
        'Python의 asyncio 라이브러리와 multi-threading을 사용하여 I/O와 CPU 바운드 작업을 처리하는 방법을 배웁니다.',
    },
    {
      title: '컨테이너 오케스트레이션 이해: Kubernetes 기초',
      content:
        '컨테이너화된 애플리케이션을 관리하는 Kubernetes의 기본 구성 요소와 아키텍처를 탐구합니다.',
    },
    {
      title: '효과적인 RESTful API 디자인 원칙',
      content:
        'RESTful API를 설계할 때 고려해야 할 주요 원칙과 최선의 실천 방법을 살펴봅니다.',
    },
    {
      title: '모던 JavaScript: ES2021의 새로운 기능들',
      content:
        '최신 JavaScript 표준인 ES2021에서 추가된 기능들과 그 사용법에 대해 설명합니다.',
    },
    {
      title: 'React와 TypeScript를 사용한 프론트엔드 개발',
      content:
        'TypeScript를 사용하여 React 애플리케이션을 더 안정적이고 관리하기 쉽게 만드는 방법을 배웁니다.',
    },
    {
      title: 'AWS 클라우드 서비스의 기초',
      content:
        'AWS에서 제공하는 다양한 클라우드 서비스와 기본 개념을 소개하며, 각 서비스의 용도와 사용법을 다룹니다.',
    },
    {
      title: '애자일 개발 방법론과 스크럼 기법',
      content:
        '소프트웨어 개발에서 애자일과 스크럼 방법론이 어떻게 적용되는지, 그리고 팀과 프로젝트 관리에 미치는 영향에 대해 알아봅니다.',
    },
    {
      title: 'Node.js를 이용한 백엔드 프로그래밍',
      content:
        'Node.js의 기본적인 사용법부터 API 개발, 데이터베이스 연동 방법까지 살펴봅니다.',
    },
    {
      title: '블록체인 기술의 이해와 애플리케이션',
      content:
        '블록체인 기술이 무엇인지, 그리고 다양한 산업 분야에서 어떻게 활용되고 있는지에 대한 개요를 제공합니다.',
    },
    {
      title: '실시간 웹 애플리케이션 개발을 위한 Socket.IO 소개',
      content:
        '이 문서는 실시간 웹 애플리케이션 개발에 널리 사용되는 Socket.IO 라이브러리에 대해 설명하며, 기본적인 사용법과 함께 실제 예제를 다룹니다.',
    },
    {
      title: 'Angular 프레임워크를 사용한 SPA 개발 가이드',
      content:
        'Angular를 사용하여 단일 페이지 애플리케이션(SPA)을 개발하는 방법을 자세히 설명하며, 컴포넌트 기반 아키텍처를 중심으로 설명합니다.',
    },
    {
      title: '데이터 과학과 머신러닝 파이프라인 구축',
      content:
        '데이터 수집부터 처리, 모델링, 예측에 이르기까지의 전체 머신러닝 파이프라인 구축 과정을 설명합니다.',
    },
    {
      title: 'DevOps 문화 구축을 위한 주요 전략과 도구',
      content:
        '효과적인 DevOps 문화를 구축하는 방법과 이를 지원하는 현대의 도구들에 대해 소개합니다.',
    },
    {
      title: '클라우드 네이티브 애플리케이션 설계의 이해',
      content:
        '클라우드 네이티브 애플리케이션의 핵심 원리와 이를 설계하는 방법에 대해 자세히 설명합니다.',
    },
    {
      title: '자바스크립트 메모리 관리와 가비지 컬렉션',
      content:
        '자바스크립트에서 메모리 관리가 어떻게 이루어지는지, 가비지 컬렉션의 원리와 최적화 방법을 탐구합니다.',
    },
    {
      title: '안드로이드 앱 개발의 최신 트렌드와 기술',
      content:
        '안드로이드 애플리케이션 개발에 사용되는 최신 도구와 프레임워크, 그리고 현재 트렌드에 대해 설명합니다.',
    },
    {
      title: 'iOS 앱 개발을 위한 Swift의 고급 기능',
      content:
        'Swift 프로그래밍 언어의 고급 기능들을 사용하여 iOS 애플리케이션을 더 효과적으로 개발하는 방법을 배웁니다.',
    },
    {
      title: 'SOLID 원칙을 적용한 객체 지향 설계',
      content:
        '객체 지향 프로그래밍의 SOLID 원칙을 적용하는 방법과 이를 통해 얻을 수 있는 설계 개선 사항에 대해 설명합니다.',
    },
    {
      title: '크로스 플랫폼 개발 프레임워크 비교: React Native vs Flutter',
      content:
        'React Native와 Flutter, 두 크로스 플랫폼 개발 프레임워크의 장단점을 비교하고 각각의 사용 사례에 대해 설명합니다.',
    },
  ];
  const translations = titlesAndContents.map((tc, index) => ({
    id: uuidv4(),
    challengeId: challenges[index % challenges.length].id,
    userId: users[index % users.length].id,
    title: tc.title,
    content: tc.content,
    likeCount: 0,
    createdAt: subDays(new Date(), Math.floor(Math.random() * 30)),
    updatedAt: new Date(),
  }));

  await prisma.translation.createMany({
    data: translations,
    skipDuplicates: true,
  });

  console.log(`${translations.length}개의 작업물 생성`);

  // 생성된 Translation 객체 반환 (중요!)
  return translations;
};
