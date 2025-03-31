import z from 'zod';
import { UserRole } from '@prisma/client';
// export const TranslationParamsSchema = z.object({
//   challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
// });

export const TranslationParamsSchema = z.object({
  challengeId: z.string().min(1, { message: '챌린지 ID는 필수 항목입니다.' }),
});

// 쿼리 파라미터 스키마
export const TranslationListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});

export type TranslationRequestParams = z.infer<typeof TranslationParamsSchema>;
export type TranslationRequestListQuery = z.infer<
  typeof TranslationListQuerySchema
>;

export interface TranslationListResponse {
  totalCount: number;
  translations: TranslationResponse[];
}

// 번역물 ID 포함 파라미터 타입
export const TranslationParamsWithIdSchema = TranslationParamsSchema.extend({
  translationId: z.string().min(1, { message: '번역물 ID는 필수 항목입니다.' }),
});

export type TranslationParamsWithId = z.infer<
  typeof TranslationParamsWithIdSchema
>;
export const TranslationRequestBody = z.object({
  title: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 20, {
      message: '제목은 최소 1자 이상 최대 20자 이하로 입력해주세요.',
    }),

  content: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 300, {
      message: '내용은 최소 1자 이상 최대 300자 이하로 입력해주세요.',
    }),

  userId: z.string().min(1, { message: '사용자 ID를 입력해주세요' }),
});

export type TranslationRequestBody = z.infer<typeof TranslationRequestBody>;

// 번역물 수정 요청 바디 스키마
export const TranslationUpdateBodySchema = z.object({
  title: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 20, {
      message: '제목은 최소 1자 이상 최대 20자 이하로 입력해주세요.',
    }),
  content: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 300, {
      message: '내용은 최소 1자 이상 최대 300자 이하로 입력해주세요.',
    }),
  userId: z.string().min(1, { message: '사용자 ID는 필수 항목입니다.' }),
  userRole: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: '유효한 UserRole이 아닙니다.' }),
    })
    .optional(),
});

// 번역물 수정 요청 바디 타입
export type TranslationUpdateBody = z.infer<typeof TranslationUpdateBodySchema>;

export const TranslationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  likeCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  userNickname: z.string().optional(),
  isLiked: z.boolean().optional(),
});
export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

// 번역물 상세 조회 응답 타입
//TODO: isLiked는 로직 처리
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
