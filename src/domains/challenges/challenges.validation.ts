import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import z from 'zod';
import { Order } from './challenges.type';

export const ChallengeParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export const ChallengeQueriesSchema = z.object({
  documentType: z.nativeEnum(DocumentType, { errorMap: () => ({ message: "잘못된 문서 유형입니다."})}).optional(),
  fields: z.nativeEnum(FieldType, { errorMap: () => ({ message: "잘못된 카테고리 유형입니다."})}).optional(),
  approvalStatus: z.nativeEnum(ApprovalStatus, { errorMap: () => ({ message: "잘못된 상태 유형입니다."})}).optional(),
  keyword: z.string({ message: "검색어는 문자열이어야 합니다."}).optional(),
  page: z.string({ message: "페이지는 문자열이어야 합니다."}).optional(),
  limit: z.string({ message: "페이지 사이즈는 문자열이어야 합니다."}).optional(),
  orderBy: z.nativeEnum(Order,{ errorMap: () => ({ message: "잘못된 정렬 유형입니다."})}).optional(),
});

export const ChallengeBodySchema = z.object({
  title: z.string().min(2, "제목은 최소 2자 이상이어야 합니다.").max(15, "제목은 최대 15자까지 입력할 수 있습니다."),
  description: z.string().min(10, "설명은 최소 10자 이상이어야 합니다.").max(100, "설명은 최대 100자 이상이어야 합니다."),
  documentType: z.nativeEnum(DocumentType, { errorMap: () => ({ message: "잘못된 문서 유형입니다."})}),
  field: z.nativeEnum(FieldType, { errorMap: () => ({ message: "잘못된 카테고리 유형입니다."})}),
  maxParticipants: z.number().min(5, "최대 인원 수는 5명 이상이어야 합니다.").max(20, "최대 인원 수는 20명 이하이어야 합니다."),
  deadline: z.string().datetime({ message : "마감일은 날짜 형식이어야 합니다."}),
  originURL: z.string().url("유효한 URL을 입력해주세요."),
});

export type ChallengeRequestParams = z.infer<typeof ChallengeParamsSchema>;
export type ChallengeRequestQueries = z.infer<typeof ChallengeQueriesSchema>;
export type ChallengeRequestBody = z.infer<typeof ChallengeBodySchema>;