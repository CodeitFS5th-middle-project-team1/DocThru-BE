import { Feedback } from '@prisma/client';

export interface GetFeedbackListResponse {
  feedbacks: Feedback[];
}

export interface PostFeedBackResponse {
  feedback: Feedback;
}

export interface PatchFeedBackResponse {
  feedback: Feedback;
}

export interface DeleteFeedBackResponse {
  feedback: Feedback;
}
