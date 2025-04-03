import { z } from 'zod';

export const ChallengeAdminParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export const ChallengeAdminRejectBodySchema = z.object({
  rejectedReason: z
    .string()
    .min(1, { message: '이유는 최소 1글자 이상이어야 합니다.' }),
});

export type ChallengeAdminParams = z.infer<typeof ChallengeAdminParamsSchema>;
export type ChallengeAdminRejectBody = z.infer<
  typeof ChallengeAdminRejectBodySchema
>;
