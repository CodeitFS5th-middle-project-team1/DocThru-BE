import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: 'USER' | 'ADMIN';
  tokenType: 'access' | 'refresh';
}

const createToken = (
  user: { id: string; role: 'USER' | 'ADMIN' },
  tokenType: 'access' | 'refresh'
) => {
  const payload = {
    id: user.id,
    role: user.role,
    tokenType,
  };

  const expiresIn = tokenType === 'access' ? '10m' : '1d';
  const secret =
    tokenType === 'access'
      ? process.env.JWT_ACCESS_SECRET || 'access-secret'
      : process.env.JWT_REFRESH_SECRET || 'refresh-secret';

  console.log(
    '🧪 JWT_ACCESS_SECRET from process.env:',
    process.env.JWT_ACCESS_SECRET
  );
  console.log(
    '🧪 JWT_REFRESH_SECRET from process.env:',
    process.env.JWT_REFRESH_SECRET
  );

  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (
  token: string,
  tokenType: 'access' | 'refresh'
): CustomJwtPayload | null => {
  try {
    const secret =
      tokenType === 'access'
        ? process.env.JWT_ACCESS_SECRET || 'access-secret'
        : process.env.JWT_REFRESH_SECRET || 'refresh-secret';
    console.log('🔍 token:', token);
    console.log('🔍 tokenType:', tokenType);
    console.log('🔍 secret:', secret);

    const payload = jwt.verify(token, secret) as CustomJwtPayload;

    // 토큰이 실제 의도된 타입인지
    if (payload.tokenType !== tokenType) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};

export default {
  createToken,
  verifyToken,
};
