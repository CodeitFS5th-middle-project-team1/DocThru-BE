import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import z from 'zod';


// TODO: 테스트용입니다. 나중에 삭제 예정입니다.
export const ChallengeParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export const ChallengeQueriesSchema = z.object({
  documentType: z.nativeEnum(DocumentType).optional(),
  fields: z.nativeEnum(FieldType).optional(),
  approvalStatus: z.nativeEnum(ApprovalStatus).optional(),
  keyword: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const ChallengeBodySchema = z.object({
  title: z.string().min(2).max(15),
  description: z.string().min(10).max(100),
  documentType: z.nativeEnum(DocumentType),
  field: z.nativeEnum(FieldType),
  maxParticipants: z.number().min(5).max(20),
  deadline: z.string().datetime(),
  originURL: z.string().url(),
});

export type ChallengeRequestParams = z.infer<typeof ChallengeParamsSchema>;
export type ChallengeRequestQueries = z.infer<typeof ChallengeQueriesSchema>;
export type ChallengeRequestBody = z.infer<typeof ChallengeBodySchema>;