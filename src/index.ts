import app from './app';
import cron from 'node-cron';
import prisma from './prismaClient';

const PORT = process.env.PORT || 3000;

cron.schedule('0 0 * * *', async () => {
  console.log('🌙 매일 자정 - Challenge 마감 상태 확인 중...');
  const now = new Date();

  try {
    const challenges = await prisma.challenge.findMany({
      where: { isDeadlineFull: false },
    });

    for (const challenge of challenges) {
      if (now > new Date(challenge.deadline)) {
        await prisma.challenge.update({
          where: { id: challenge.id },
          data: { isDeadlineFull: true },
        });
        console.log(`✅ Challenge ${challenge.id} 마감 처리 완료`);
      }
    }
  } catch (err) {
    console.error('❌ 자정 크론탭 에러:', err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('🌍 서버 시작 - JWT_SECRET:', process.env.JWT_SECRET_KEY);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});
