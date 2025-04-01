import { Feedback } from '@prisma/client';

export interface GetFeedbackListResponse {
  feedbacks: Feedback[];
}
