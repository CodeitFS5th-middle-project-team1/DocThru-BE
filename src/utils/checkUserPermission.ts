import prisma from '../prismaClient';

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}
// 사용자 권한 확인 유틸리티 함수
export const checkUserPermission = async (
  userId: string,
  resourceOwnerId: string
): Promise<boolean> => {
  // 자신의 리소스인 경우 권한 있음
  if (userId === resourceOwnerId) {
    return true;
  }

  // 자신의 리소스가 아닌 경우 관리자 여부 확인
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new NotFoundError(`User with ID ${userId} not found`);
  }

  // 관리자인 경우 권한 있음
  return user.role === 'ADMIN';
};
