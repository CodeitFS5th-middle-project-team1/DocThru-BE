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

export type TranslationRequestParams = z.infer<typeof TranslationParamsSchema>;
export type TranslationRequestListQuery = z.infer<
  typeof TranslationListQuerySchema
>;
