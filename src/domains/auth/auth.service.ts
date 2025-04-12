import prisma from '../../prismaClient';
import bcrypt from 'bcrypt';
import CustomError from '../../types/error';
import { SignUpBodyDTO } from './auth.types';

const createUser = async (data: SignUpBodyDTO) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        nickname: data.nickName,
        password: hashedPassword,
      },
    });

    return user;
  } catch (err) {
    throw new CustomError(500, '사용자 생성 중 오류 발생');
  }
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

const checkPassword = async (
  userInputPassword: string,
  hashedPassword: string
) => {
  const isCorrect = await bcrypt.compare(userInputPassword, hashedPassword);
  return isCorrect;
};

const saveRefreshToken = async (email: string, refreshToken: string) => {
  await prisma.user.update({
    where: {
      email,
    },
    data: {
      refreshToken,
    },
  });
};

const getRefreshToken = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      refreshToken: true,
    },
  });
  return user?.refreshToken;
};

const updateRefreshToken = async (id: string, newRefreshToken: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: { refreshToken: newRefreshToken },
  });
};

const AuthService = {
  createUser,
  findUserByEmail,
  findUserById,
  checkPassword,
  saveRefreshToken,
  getRefreshToken,
  updateRefreshToken,
};

export default AuthService;
