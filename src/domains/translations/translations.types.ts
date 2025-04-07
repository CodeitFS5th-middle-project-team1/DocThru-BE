import z from 'zod';
import { DocumentType, FieldType, UserRole } from '@prisma/client';
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
    .refine((val) => val.length >= 1 && val.length <= 50, {
      message: '제목은 최소 1자 이상 최대 50자 이하로 입력해주세요.',
    }),

  content: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 1000, {
      message: '내용은 최소 1자 이상 최대 1000자 이하로 입력해주세요.',
    }),
});

export type TranslationRequestBody = z.infer<typeof TranslationRequestBody>;

// 번역물 수정 요청 바디 스키마
export const TranslationUpdateBodySchema = z.object({
  title: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 50, {
      message: '제목은 최소 1자 이상 최대 50자 이하로 입력해주세요.',
    }),
  content: z
    .string()
    .trim()
    .refine((val) => val.length >= 1 && val.length <= 1000, {
      message: '내용은 최소 1자 이상 최대 1000자 이하로 입력해주세요.',
    }),
});

// 번역물 수정 요청 바디 타입
export type TranslationUpdateBody = z.infer<typeof TranslationUpdateBodySchema>;

// 유저 정보 스키마
export const UserInfoSchema = z.object({
  id: z.string(),
  nickname: z.string().nullable(),
});
// enum 타입을 zod 스키마로 변환
const DocumentTypeSchema = z.nativeEnum(DocumentType);
const FieldTypeSchema = z.nativeEnum(FieldType);
// TranslationResponseSchema 수정
export const TranslationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  user: UserInfoSchema,
  challengeId: z.string(),
  likeCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  isLiked: z.boolean().optional(),
  documentType: DocumentTypeSchema.optional(), // 챌린지의 문서 타입
  field: FieldTypeSchema.optional(), // 챌린지의 분야
});

export type UserInfo = z.infer<typeof UserInfoSchema>;
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

// 번역물 삭제 요청 바디 스키마
export const TranslationDeleteBodySchema = z.object({
  userId: z.string().min(1, { message: '사용자 ID는 필수 항목입니다.' }),
  userRole: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: '유효한 사용자 역할이 아닙니다.' }),
    })
    .optional(),
});

// 번역물 삭제 요청 바디 타입
export type TranslationDeleteBody = z.infer<typeof TranslationDeleteBodySchema>;
export const TranslationDetailResponseSchema = TranslationResponseSchema.extend(
  {
    isLiked: z.boolean().optional(),
  }
);
