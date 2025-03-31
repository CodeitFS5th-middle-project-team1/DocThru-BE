import { Challenge, DocumentType, FieldType } from '@prisma/client';

export interface GetChallengeParam {
  challengeId: string;
}

export interface PostChallengeResponse {
  challenge: Challenge | null;
  code: number;
}

export interface UpdateChallengeResponse {
  challenge: Challenge | null;
  code: number;
}

export interface GetChallengeResponse {
  challenge: Challenge | null;
}

export interface GetChallengeListResponse {
  challenges: Challenge[] | [];
  totalCount: number;
}

export interface UpdateChallengeRequest {
  id: string;
  title: string;
  description: string;
  documentType: DocumentType;
  field: FieldType;
  maxParticipants: number;
  deadline: string;
  originURL: string;
}