import z from 'zod';
// INFO: 테스트
export const TranslationParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});
export const TranslationListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
export const TranslationParamsWithIdSchema = TranslationParamsSchema.extend({
  translationId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});
export const TranslationRequestBody = z.object({
  title: z.string().min(1, { message: '제목은 필수입니다.' }),
  content: z.string().min(1, { message: '내용은 필수입니다.' }),
  userId: z.string().optional(),
});
export type TranslationRequestBody = z.infer<typeof TranslationRequestBody>;
export type TranslationRequestParams = z.infer<typeof TranslationParamsSchema>;
export type TranslationRequestListQuery = z.infer<
  typeof TranslationListQuerySchema
>;
