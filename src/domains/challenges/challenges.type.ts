import { ApprovalStatus, Challenge, DocumentType, FieldType } from '@prisma/client';

export interface GetChallengeParam {
  challengeId: string;
}

export interface GetChallengeListQuery {
  documentType: DocumentType | undefined;
  fields: FieldType | FieldType[];
  approvalStatus: ApprovalStatus;
  keyword: string | undefined;
  page: string;
  limit: string;
}

export interface GetChallengeResponse {
  challenge: Challenge | null;
}
export interface GetChallengeListResponse {
  challenges: Challenge[] | [];
  totalCount: number;
}

