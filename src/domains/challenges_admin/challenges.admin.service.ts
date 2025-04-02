import prisma from '../../prismaClient';

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

export default {
  checkChallenge,
  approveChallenge,
};
