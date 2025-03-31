import { User, UserRole } from '@prisma/client';

export function checkPermission(
  user: User,
  userId: string,
  userRole?: UserRole
): boolean {
  return user.id === userId || userRole === UserRole.ADMIN;
}
