// drafts.types.ts 확장
import { z } from 'zod';

// 공통 타입 정의
export interface DraftTranslationParams {
  userId: string;
  challengeId: string;
}

// 요청 타입
export interface DraftTranslationRequestBody {
  title?: string;
  content?: string;
}

// 요청 파라미터
export interface DraftTranslationRequestParams {
  challengeId: string;
}

// 응답 타입
export interface DraftTranslationResponse {
  id: string;
  title: string;
  content: string;
  userId: string;
  challengeId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Zod 스키마
export const DraftTranslationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 요청 스키마
export const DraftTranslationRequestBodySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});
