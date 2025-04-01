import z from 'zod';

export const GetFeedBackListSchema = z.object({
  translationId: z.string().uuid({ message: 'traslationId는 uuid' }),
});

export type GetFeedBackListParams = z.infer<typeof GetFeedBackListSchema>;
