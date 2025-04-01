import z from 'zod';

export const FeedBackSchema = z.object({
  translationId: z.string().uuid({ message: 'traslationId는 uuid' }),
});

export const PostFeedBackBodySchema = z.object({
  userId: z.string().uuid({ message: 'userId가 uuid' }),
  content: z.string(),
});

export type FeedBackParams = z.infer<typeof FeedBackSchema>;
export type PostFeedBackBodyParams = z.infer<typeof PostFeedBackBodySchema>;

