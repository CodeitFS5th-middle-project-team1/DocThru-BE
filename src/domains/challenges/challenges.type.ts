import { ApprovalStatus, FieldType } from '@prisma/client';

export interface GetChallengeParam {
  challengeId: string;
}

export interface GetChallengeResponse {
  challenge: Challenge | null;
}

export type Challenge = {
  id: string;
  field: FieldType;
  userId: string;
  title: string;
  originURL: string;
  documentType: string;
  deadline: Date; // Date 타입으로 수정
  maxParticipants: number;
  currentParticipants: number;
  description: string;
  content: string;
  deletedAt: Date | null; // Date 타입으로 수정
  createdAt: Date; // Date 타입으로 수정
  updatedAt: Date; // Date 타입으로 수정
  deletedReason: string | null;
  rejectedReason: string | null;
  approvalStatus: ApprovalStatus;
} | null;
