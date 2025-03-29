import { Translation } from '@prisma/client';

export interface ChallengeParams {
  challengeId: string;
}
export interface GetTranslationListQuery {
  page?: string;
  limit?: string;
}
export interface TranslationListResponse {
  totalCount: number;
  translations: TranslationResponse[];
}

export interface TranslationParams extends ChallengeParams {
  translationId: string;
  userId?: string; // 좋아요 여부 확인용 선택적 파라미터
}

export interface TranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  createdAt: Date;
  updatedAt?: Date;
  userNickname?: string; // 추가 필드 (선택적)
  isLiked?: boolean; // 추가 필드 (선택적)
}

// 번역물 상세 조회 응답 타입
//isLiked 사용자가 해당 번역물을 좋아요 했는지 여부를 나타내는 boolean
//TODO: isLiked는 로직 처리 프론트에서 처리하는게 좋을듯
export interface TranslationByIdResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface PostTranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

// export interface UpdateTranslationRequest {
//   title?: string;
//   content?: string;
// }

// export interface UpdateTranslationResponse {
//   id: string;
//   title: string;
//   content: string;
//   userId: string;
//   challengeId: string;
//   likeCount: number;
//   updatedAt: Date;
// }
