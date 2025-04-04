import { z } from 'zod';

// 파라미터 스키마
export const DraftTranslationParamsSchema = z.object({
  userId: z.string().min(1),
  challengeId: z.string().min(1),
});

// 요청 파라미터
export interface DraftTranslationRequestParams {
  challengeId: string;
}

// 응답 타입
export const DraftTranslationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  message: z.string().optional(),
});

// 요청 스키마
export const DraftTranslationRequestBodySchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
  })
  .refine(
    // 최소한 title이나 content 중 하나 비어있지 않으면 true
    (data) =>
      !(
        (!data.title || data.title.trim() === '') &&
        (!data.content || data.content.trim() === '')
      ),
    {
      message: '저장할 내용이 없습니다. 제목이나 내용을 입력해주세요.',
      path: ['title'],
    }
  );

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type DraftTranslationParams = z.infer<
  typeof DraftTranslationParamsSchema
>;
export type DraftTranslationRequestBody = z.infer<
  typeof DraftTranslationRequestBodySchema
>;
export type DraftTranslationResponse = z.infer<
  typeof DraftTranslationResponseSchema
>;

export interface DraftTranslationRequestParams {
  challengeId: string;
}
