import { ApprovalStatus, DocumentType, FieldType } from "@prisma/client";


export interface GetChallengesParams {
  documentType: DocumentType | undefined;
  fields: FieldType | FieldType[];
  approvalStatus: ApprovalStatus;
  keyword: string | undefined;
  page: number;
  limit: number;
}