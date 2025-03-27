import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import jwtUtils from '../../utils/jwt';
import { tr } from 'date-fns/locale';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: email, nickname, password를 입력받아 회원가입을 수행합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - nickName
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               nickName:
 *                 type: string
 *                 example: codeit
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     nickName:
 *                       type: string
 *                       example: codeit
 *       400:
 *         description: 잘못된 요청 또는 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이미 존재하고 있는 email 입니다.
 */
const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, nickName, password } = req.body;

  console.log(email, nickName, password);

  // 유효성 검사
  if (!email || !nickName || !password) {
    next({
      statusCode: 400,
      message: 'email, nickname, password가 모두 있어야 햡니다.',
    });
    return;
  }

  try {
    const existedUser = await AuthService.checkEmail(email);

    if (existedUser) {
      next({
        statusCode: 400,
        message: '이미 존재하고 있는 email 입니다.',
      });
      return;
    }

    const user = await AuthService.createUser({ email, nickName, password });

    res.status(201).json({
      user: {
        email: user.email,
        nickName: user.nickname,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     description: email과 password를 입력받아 로그인합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       400:
 *         description: 잘못된 요청 (email 또는 password 누락)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: email, password가 모두 있어야 합니다.
 *       404:
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 없는 유저입니다.
 *       401:
 *         description: 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 비밀번호가 일치하지 않습니다.
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next({ statusCode: 400, message: 'email, password가 모두 있어야 합니다.' });
    return;
  }

  const existedUser = await AuthService.checkEmail(email);

  if (!existedUser) {
    next({ statusCode: 404, message: '없는 유저입니다.' });
    return;
  }

  const isCorrect = await AuthService.checkPassword(
    password,
    existedUser.password
  );

  if (!isCorrect) {
    next({ statusCode: 401, message: '비밀번호가 일치하지 않습니다.' });
    return;
  }

  const accessToken = jwtUtils.createToken(existedUser, 'access');
  const refreshToken = jwtUtils.createToken(existedUser, 'refresh');
  await AuthService.saveRefreshToken(existedUser.email, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.status(200).json({
    accessToken,
  });
};

export default {
  signup,
  login,
};
