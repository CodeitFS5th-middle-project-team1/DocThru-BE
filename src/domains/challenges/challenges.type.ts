import { ApprovalStatus, Challenge, DocumentType, FieldType } from '@prisma/client';

export interface GetChallengeParam {
  challengeId: string;
}

export interface PostChallengeResponse {
  challenge: Challenge | null;
  code: number;
}

export interface DeleteChallengeResponse {
  code: number;
}

export interface UpdateChallengeResponse {
  challenge: Challenge | null;
  code: number;
}

export interface GetChallengeResponse {
  challenge: Challenge | null;
}

export interface GetChallengeListByAdminResponse {
  challenges: {
    idx: number;
    title: string;
    field: FieldType;
    maxParticipants: number;
    deadline: Date;
    createdAt: Date;
    documentType: DocumentType;
    approvalStatus: ApprovalStatus;
  }[],
  totalCount: number;
}

export interface GetChallengeListResponse {
  challengesWithIsMax: {
    title: string;
    field: FieldType;
    maxParticipants: number;
    currentParticipants: number;
    deadline: Date;
    documentType: DocumentType;
    isMax: boolean;
  }[];
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

export enum Order {
  applyFirst = 'applyFirst',
  applyLast = 'applyLast',
  deadLineFirst = 'deadLineFirst',
  deadLineLast = 'deadLineLast',
}