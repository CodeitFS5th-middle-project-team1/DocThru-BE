import prisma from "../../prismaClient";
import { getParticipantsOptions } from "./participants.types";

const getParticipants = async ({id, page="1", limit="5"}: getParticipantsOptions) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const participants = await prisma.challengeParticipant.findMany({
    where: {
      challengeId: id,
    },
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    include: {
      user: {
        select: {
          translations: {
            where: {
              challengeId: id,
            },
            select: {
              likeCount: true,
            },
          }
        }
      }
    }
  });
  const totalCount = await prisma.challengeParticipant.count({
    where: {
      challengeId: id,
    },
  })

  return {participants, totalCount};
}



const ParticipantsService = {
  getParticipants,
}

export default ParticipantsService;