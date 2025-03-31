import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const screctKey = process.env.JWT_SECRET_KEY || 'secret';

const createToken = (user: User, tokenType: 'access' | 'refresh') => {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const expiresIn = tokenType == 'access' ? '1h' : '1w';
  const token = jwt.sign(payload, screctKey, { expiresIn });
  return token;
};

export default {
  createToken,
};
