import { z } from 'zod';

export const LikeParamsSchema = z.object({
  translationId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export type LikeRequestParams = z.infer<typeof LikeParamsSchema>;
