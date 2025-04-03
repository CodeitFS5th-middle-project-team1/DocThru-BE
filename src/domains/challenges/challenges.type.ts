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
    id: string;
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
  challenges: {
    id: string;
    title: string;
    field: FieldType;
    maxParticipants: number;
    currentParticipants: number;
    deadline: Date;
    documentType: DocumentType;
    isParticipantsFull: boolean;
    isDeadlineFull: boolean;
  }[];
  totalCount: number;
}

export interface UpdateChallengeArgs {
  id: string;
  title: string;
  description: string;
  documentType: DocumentType;
  field: FieldType;
  maxParticipants: number;
  deadline: string;
  originURL: string;
}

export interface CreateChallengeArgs {
  userId: string;
  title: string;
  description: string;
  documentType: DocumentType;
  field: FieldType;
  maxParticipants: number;
  deadline: string;
  originURL: string;
}

export interface GetChallengeListByUserArgs {
  orderBy: Order | undefined;
  page: string | undefined;
  limit: string | undefined;
  approvalStatus: ApprovalStatus | undefined;
  keyword: string | undefined;
  userId: string;
}

export interface GetChallengeListParticipating {
  documentType: DocumentType | undefined;
  fields: FieldType | undefined;
  keyword: string | undefined;
  page: string | undefined;
  limit: string | undefined;
  userId: string;
  isExpired: string;
}


export enum Order {
  applyFirst = 'applyFirst',
  applyLast = 'applyLast',
  deadLineFirst = 'deadLineFirst',
  deadLineLast = 'deadLineLast',
}