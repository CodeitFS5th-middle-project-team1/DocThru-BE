import { ApprovalStatus, Challenge, DocumentType, FieldType } from '@prisma/client';

export interface GetChallengeParam {
  challengeId: string;
}

export interface PostChallengeResponse {
  challenge: Challenge | null;
}

export interface GetChallengeResponse {
  challenge: Challenge | null;
}
export interface GetChallengeListResponse {
  challenges: Challenge[] | [];
  totalCount: number;
}
