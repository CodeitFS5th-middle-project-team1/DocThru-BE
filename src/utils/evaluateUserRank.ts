import { PrismaClient, UserRank } from '@prisma/client';
import { notifyUser } from '../domains/notifications/notifications.utils';

const prisma = new PrismaClient();

export async function evaluateUserRank(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      participationCount: true,
      recommendedCount: true,
      rank: true,
    },
  });

  if (!user) {
    throw new Error('유저 not found');
  }

  const { participationCount, recommendedCount, rank } = user;

  // const isExpert: boolean =
  //   (participationCount >= 5 && recommendedCount >= 5) ||
  //   participationCount >= 10 ||
  //   recommendedCount >= 10;
  const hasBoth = participationCount >= 5 && recommendedCount >= 5;
  const hasEnoughParticipation = participationCount >= 10;
  const hasEnoughRecommendation = recommendedCount >= 10;

  const isExpert = hasBoth || hasEnoughParticipation || hasEnoughRecommendation;

  console.log({
    userId,
    participationCount,
    recommendedCount,
    rank,
    hasBoth,
    hasEnoughParticipation,
    hasEnoughRecommendation,
    isExpert,
  });
  if (isExpert && rank !== UserRank.EXPERT) {
    await prisma.user.update({
      where: { id: userId },
      data: { rank: UserRank.EXPERT },
    });

    await notifyUser({
      userId,
      category: 'admin',
      type: 'approved',
      message: '🎉 축하합니다! 전문가(EXPERT)로 승급되었습니다!',
    });

    console.log(`🎉 유저 ${userId}님이 전문가(EXPERT)로 승급되었습니다!`);
  }
}
