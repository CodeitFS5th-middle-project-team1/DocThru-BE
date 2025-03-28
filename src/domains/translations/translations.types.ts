export interface TranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface TranslationListResponse {
  totalCount: number;
  translations: TranslationResponse[];
}

export interface CreateTranslationRequest {
  title: string;
  content: string;
  userId: string;
  challengeId: string;
}

export interface CreateTranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  createdAt: Date;
  //  updatedAt?: Date;
}

export interface UpdateTranslationRequest {
  title?: string;
  content?: string;
}

export interface UpdateTranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  likeCount: number;
  //createdAt: Date;
  updatedAt: Date;
}
