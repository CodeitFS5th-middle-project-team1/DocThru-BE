# 📝 독스루 (DocThru) - BE
[Docthru API 문서 바로가기](https://docthru-be-wstf.onrender.com/api-docs/)

## 📌 프로젝트 소개

**DocThru**는 기술 문서 번역을 통해 개발자들이 함께 성장할 수 있도록 도와주는 **챌린지 기반 협업 번역 플랫폼**입니다.

- 사용자는 번역하고 싶은 기술 문서의 원문 링크와 함께, 마감일 및 최대 참여 인원을 설정하여 번역 챌린지를 생성(신청)할 수 있습니다.
- 관리자는 번역 챌린지를 **승인/거절/**하거나, 사용자의 번역물을 **목록 및 상세 조회**할 수 있습니다.
- 지정된 챌린지 문서를 **웹 기반 에디터**에서 번역하고, 다른 사용자로부터 피드백과 추천(좋아요)을 받을 수 있습니다.
- 일반 사용자는 번역물을 10회 제출하거나, 또는 번역물 5회 제출 + 5회 이상 추천을 받을 경우, 전문가로 승급됩니다.


- ## 🗓️ 개발 기간

**2025년 3월 24일 (월) ~ 4월 16일 (화)**  
총 약 3주간 진행

## 👨‍👩‍👧‍👦 팀원 정보

| 이름 | 백엔드 주요 담당 역할 |
|------|----------------------|
| [이동혁](https://github.com/hyuk-dev) | DB 모델링, 챌린지, 관리자 API |
| [최은비](https://github.com/silverraining) | DB 모델링, 작업물, 임시저장, 알림 API |
| [김승우](https://github.com/stevenkim18) | DB 모델링, 인증/인가, 관리자, 피드백, 좋아요 API |


### Backend  
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

### Database  
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### 배포  
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)


## 프로젝트 구조
<details>
  <summary>파일 트리 보기</summary>

  ```
📦 src
 ┣ 📂application
 ┣ 📂domains
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜auth.controller.ts
 ┃ ┃ ┣ 📜auth.routes.ts
 ┃ ┃ ┣ 📜auth.service.ts
 ┃ ┃ ┗ 📜auth.types.ts
 ┃ ┣ 📂challenges
 ┃ ┃ ┣ 📜challenges.controller.ts
 ┃ ┃ ┣ 📜challenges.routes.ts
 ┃ ┃ ┣ 📜challenges.service.ts
 ┃ ┃ ┣ 📜challenges.type.ts
 ┃ ┃ ┗ 📜challenges.validation.ts
 ┃ ┣ 📂challenges_admin
 ┃ ┃ ┣ 📜challenges.admin.controller.ts
 ┃ ┃ ┣ 📜challenges.admin.routes.ts
 ┃ ┃ ┣ 📜challenges.admin.service.ts
 ┃ ┃ ┣ 📜challenges.admin.type.ts
 ┃ ┃ ┗ 📜challenges.admin.validation.ts
 ┃ ┣ 📂drafts
 ┃ ┃ ┣ 📜drafts.controller.ts
 ┃ ┃ ┣ 📜drafts.routes.ts
 ┃ ┃ ┣ 📜drafts.service.ts
 ┃ ┃ ┗ 📜drafts.type.ts
 ┃ ┣ 📂feedbacks
 ┃ ┃ ┣ 📜feedbacks.controller.ts
 ┃ ┃ ┣ 📜feedbacks.routes.ts
 ┃ ┃ ┣ 📜feedbacks.service.ts
 ┃ ┃ ┣ 📜feedbacks.type.ts
 ┃ ┃ ┗ 📜feedbacks.validation.ts
 ┃ ┣ 📂likes
 ┃ ┃ ┣ 📜likes.controller.ts
 ┃ ┃ ┣ 📜likes.routes.ts
 ┃ ┃ ┣ 📜likes.service.ts
 ┃ ┃ ┣ 📜likes.types.ts
 ┃ ┃ ┗ 📜likes.validation.ts
 ┃ ┣ 📂notifications
 ┃ ┃ ┣ 📜notifications.controller.ts
 ┃ ┃ ┣ 📜notifications.routes.ts
 ┃ ┃ ┣ 📜notifications.service.ts
 ┃ ┃ ┗ 📜notifications.utils.ts
 ┃ ┣ 📂participants
 ┃ ┃ ┣ 📜participants.controller.ts
 ┃ ┃ ┣ 📜participants.routes.ts
 ┃ ┃ ┣ 📜participants.service.ts
 ┃ ┃ ┣ 📜participants.types.ts
 ┃ ┃ ┗ 📜participants.validation.ts
 ┃ ┣ 📂translations
 ┃ ┃ ┣ 📜translations.controller.ts
 ┃ ┃ ┣ 📜translations.routes.ts
 ┃ ┃ ┣ 📜translations.service.ts
 ┃ ┃ ┗ 📜translations.types.ts
 ┃ ┗ 📂users
 ┃ ┃ ┣ 📜users.controller.ts
 ┃ ┃ ┣ 📜users.routes.ts
 ┃ ┃ ┗ 📜users.service.ts
 ┃ 📜routes.ts
 ┣ 📂middleware
 ┃ ┣ 📜errorHandler.ts
 ┃ ┣ 📜validateRequestData.ts
 ┃ ┗ 📜verifyJWTToken.ts
 ┣ 📂types
 ┃ ┣ 📜error.ts
 ┃ ┣ 📜express.d.ts
 ┃ ┗ 📜express.ts
 ┣ 📂utils
 ┃ ┣ 📜checkPermission.ts
 ┃ ┣ 📜evaluateUserRank.ts
 ┃ ┣ 📜isUUID.ts
 ┃ ┣ 📜isValidEnumValue.ts
 ┃ ┣ 📜jwt.ts
 ┃ ┗ 📜prismaClient.ts
 ┣ 📜app.ts
 ┣ 📜index.ts
 ┣ 📜swagger.ts
```
</details>

## 주요 트러블 슈팅

## 회고
