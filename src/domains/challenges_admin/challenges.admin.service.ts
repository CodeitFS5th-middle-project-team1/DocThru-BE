import prisma from '../../prismaClient';
import {
  GetChallengeResponse,
  UpdateChallengeArgs,
} from '../challenges/challenges.type';

const checkChallenge = async (id: string) => {
  const challenge = await prisma.challenge.findUnique({
    where: {
      id,
    },
  });
  return challenge;
};

const approveChallenge = async (id: string) => {
  const updateChallenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      approvalStatus: 'APPROVED',
      approvalAt: new Date(),
    },
  });
  return updateChallenge;
};

const rejectChallenge = async (id: string, rejectedReason: string) => {
  const updateChallenge = await prisma.challenge.update({
    where: { id },
    data: {
      rejectedReason,
      approvalStatus: 'REJECTED',
      rejectedAt: new Date(),
    },
  });
  return updateChallenge;
};

const deleteChallengeForce = async (
  id: string,
  deletedReason: string
): Promise<GetChallengeResponse> => {
  const challenge = await prisma.challenge.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      deletedReason,
      approvalStatus: 'DELETED',
    },
  });
  return { challenge };
};

const updateChallengeForce = async ({
  id,
  title,
  description,
  documentType,
  field,
  maxParticipants,
  deadline,
  originURL,
}: UpdateChallengeArgs) => {
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
export const getTranslatorUserIdsByChallengeId = async (
  challengeId: string
): Promise<string[]> => {
  const translators = await prisma.translation.findMany({
    where: {
      challengeId,
      deletedAt: null,
    },
    select: {
      userId: true,
    },
    distinct: ['userId'],
  });

  return translators.map((t) => t.userId);
};

export default {
  checkChallenge,
  approveChallenge,
  rejectChallenge,
  deleteChallengeForce,
  updateChallengeForce,
  getTranslatorUserIdsByChallengeId,
};
