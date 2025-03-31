import { DocumentType, FieldType } from '@prisma/client';
import prisma from '../../prismaClient';
import { GetChallengeResponse, UpdateChallengeRequest } from './challenges.type';
import {
  ChallengeParamsSchema,
  ChallengeQueriesSchema,
  ChallengeRequestBody,
  ChallengeRequestQueries,
} from './challenges.validation';

const getChallenge = async (id: string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id,
    },
  });
  return { challenge };
};

/**
 * @swagger
 * /api/challenges:
 *   get:
 *     summary: Retrieve a list of challenges
 *     description: Fetch a paginated list of challenges based on filters such as document type, fields, approval status, and keyword.
 *     tags:
 *       - Challenges
 *     parameters:
 *       - in: query
 *         name: documentType
 *         schema:
 *           type: string
 *           enum: [TYPE_A, TYPE_B, TYPE_C] # Replace with actual DocumentType enum values
 *         description: Filter challenges by document type
 *       - in: query
 *         name: fields
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [FIELD_X, FIELD_Y, FIELD_Z] # Replace with actual FieldType enum values
 *         description: Filter challenges by fields
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED] # Replace with actual approval status values
 *         description: Filter challenges by approval status
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search challenges by title or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of challenges per page
 *     responses:
 *       200:
 *         description: A list of challenges and the total count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 challenges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       field:
 *                         type: string
 *                       maxParticipants:
 *                         type: integer
 *                       currentParticipants:
 *                         type: integer
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                       documentType:
 *                         type: string
 *                 totalCount:
 *                   type: integer
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
const getChallengeList = async ({
  documentType,
  fields,
  approvalStatus,
  keyword,
  page,
  limit,
}: ChallengeRequestQueries) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  const skip = (pageNum - 1) * limitNum;
  const fieldCondition =
    Array.isArray(fields) && fields.length > 0
      ? { in: fields as FieldType[] }
      : fields
      ? { equals: fields as FieldType }
      : undefined;

  const [challenges, totalCount] = await Promise.all([
    prisma.challenge.findMany({
      where: {
        documentType: documentType || undefined,
        field: fieldCondition || undefined,
        approvalStatus,
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
      skip,
      take: limitNum,
      orderBy: { createdAt : "desc" },
      select: {
        title: true,
        field: true,
        maxParticipants: true,
        currentParticipants: true,
        deadline: true,
        documentType: true,
      }
    }),
    prisma.challenge.count({
      where: {
        documentType: documentType || undefined,
        field: fieldCondition || undefined,
        approvalStatus,
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }),
      },
    }),
  ]);

  return { challenges, totalCount };
};

const postChallenge = async ({
  title,
  description,
  documentType,
  field,
  maxParticipants,
  deadline,
  originURL
}: ChallengeRequestBody
) => {
  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
      userId:"user-1",
    },
  });

  return challenge;
};

const updateChallenge = async ({
  id,
  title,
  description,
  documentType,
  field,
  maxParticipants,
  deadline,
  originURL
} : UpdateChallengeRequest
) => {
  const challenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      documentType,
      field,
      maxParticipants,
      deadline,
      originURL,
    },
  });

  return challenge;
};

const deleteChallenge = async (id: string): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.delete({
    where: {
      id,
    },
  });
  return { challenge };
};

const ChallengesService = {
  getChallengeList,
  getChallenge,
  postChallenge,
  updateChallenge,
  deleteChallenge,
};

export default ChallengesService;
