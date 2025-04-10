import prisma from '../../prismaClient';
import { GetChallengeResponse } from '../challenges/challenges.type';

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

export default {
  checkChallenge,
  approveChallenge,
  rejectChallenge,
  deleteChallengeForce,
};
