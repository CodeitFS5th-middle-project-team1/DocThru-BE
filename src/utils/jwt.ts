import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  id: string;
  role: 'USER' | 'ADMIN';
}

const secretKey = process.env.JWT_SECRET_KEY || 'secret';

const createToken = (
  user: { id: string; role: 'USER' | 'ADMIN' },
  tokenType: 'access' | 'refresh'
) => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const expiresIn = tokenType === 'access' ? '10s' : '1m';
return jwt.sign(payload, secretKey, { expiresIn });
};

const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    const payload = jwt.verify(token, secretKey) as CustomJwtPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

export default {
  createToken,
  verifyToken,
};
