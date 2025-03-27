import ChallengesService from './challenges.service';
import { isValidEnumValue } from '../../utils/isValidEnumValue';
import { ApprovalStatus, DocumentType, FieldType } from '@prisma/client';
import { Controller } from '../../types/express';
import { GetChallengesParams } from '../../types/challenges';

const getChallenges: Controller = async (req, res, next) => {
  try {
    const {
      documentType,
      fields,
      approvalStatus,
      keyword,
      page = '1',
      limit = '10',
    } = req.query;
    // 쿼리 구조분해 된 것들 각각 검증 필요
    if (
      documentType &&
      !isValidEnumValue(DocumentType, documentType.toString())
    ) {
      next({ statusCode: 400 });
      return;
    }

    if (
      approvalStatus &&
      !isValidEnumValue(ApprovalStatus, approvalStatus.toString())
    ) {
      next({ statusCode: 400 });
      return;
    }

    // fields 검증 (배열 형식이나 단일 값 검증)
    if (fields && !Array.isArray(fields)) {
      if (!isValidEnumValue(FieldType, fields.toString())) {
        return next({ statusCode: 400 });
      }
    } else if (Array.isArray(fields)) {
      for (const field of fields) {
        if (!isValidEnumValue(FieldType, field.toString())) {
          return next({ statusCode: 400 });
        }
      }
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      next({ statusCode: 400 });
      return;
    }

    const result = await ChallengesService.getChallenges({
      documentType: documentType as DocumentType,
      fields: fields as FieldType | FieldType[],
      approvalStatus: approvalStatus as ApprovalStatus,
      keyword: keyword as string,
      page: pageNumber,
      limit: limitNumber,
    });
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const ChallengesController = {
  getChallenges,
};

export default ChallengesController;
