import z from 'zod';

export const FeedBackSchema = z.object({
  translationId: z.string().uuid({ message: 'traslationId는 uuid' }),
});

export const ModifyFeedBackSchema = z.object({
  translationId: z.string().uuid({ message: 'traslationId는 uuid' }),
  feedbackId: z.string().uuid({ message: 'feedbackId는 uuid' }),
});

export const PostFeedBackBodySchema = z.object({
  content: z.string(),
});

export type FeedBackParams = z.infer<typeof FeedBackSchema>;
export type ModifyFeedBackParams = z.infer<typeof ModifyFeedBackSchema>;
export type PostFeedBackBodyParams = z.infer<typeof PostFeedBackBodySchema>;
