import z from 'zod';


export const ParticipantsParamsSchema = z.object({
  challengeId: z.string().uuid({ message: 'id는 uuid 형식이여야 합니다.' }),
});

export const ParticipantsQueriesSchema = z.object({
  page: z.string({ message: "페이지는 문자열이어야 합니다."}).optional(),
  limit: z.string({ message: "페이지 사이즈는 문자열이어야 합니다."}).optional(),
});

export const ParticipantsBodySchema = z.object({

});

export type ParticipantsRequestParams = z.infer<typeof ParticipantsParamsSchema>;
export type ParticipantsRequestQueries = z.infer<typeof ParticipantsQueriesSchema>;
export type ParticipantsRequestBody = z.infer<typeof ParticipantsBodySchema>;