import prisma from '../../prismaClient';
import bcrpyt from 'bcrypt';
import CustomError from '../../types/error';

interface SignupDTO {
  email: string;
  nickName: string;
  password: string;
}

const createUser = async (data: SignupDTO) => {
  const hashedPassword = await bcrpyt.hash(data.password, 10);

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

const checkEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

const checkPassword = async (
  userInputPassword: string,
  hashedPassword: string
) => {
  const isCorrect = await bcrpyt.compare(userInputPassword, hashedPassword);
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

const AuthService = {
  createUser,
  checkEmail,
  checkPassword,
  saveRefreshToken,
};

export default AuthService;
