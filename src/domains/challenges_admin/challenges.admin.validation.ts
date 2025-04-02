import { z } from 'zod';

export const ChallengeAdminParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export type ChallengeAdminParams = z.infer<typeof ChallengeAdminParamsSchema>;
