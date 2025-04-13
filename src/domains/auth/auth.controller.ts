import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import jwtUtils from '../../utils/jwt';
import { LoginBodyDTO, SignUpBodyDTO } from './auth.types';
import CustomError from '../../types/error';

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: 회원가입
 *     description: email, nickName, password를 입력받아 회원가입을 수행합니다.
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
  const { email, nickName, password }: SignUpBodyDTO = req.body;

  try {
    const existedUser = await AuthService.findUserByEmail(email);

    if (existedUser) {
      return next({
        statusCode: 400,
        message: '이미 존재하고 있는 email 입니다.',
      });
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
  try {
    const { email, password }: LoginBodyDTO = req.body;

    const existedUser = await AuthService.findUserByEmail(email);

    if (!existedUser) {
      throw new CustomError(401, '아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    const isValid = await AuthService.checkPassword(
      password,
      existedUser.password
    );

    if (!isValid) {
      throw new CustomError(401, '아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    const accessToken = jwtUtils.createToken(existedUser, 'access');
    const refreshToken = jwtUtils.createToken(existedUser, 'refresh');

    await AuthService.saveRefreshToken(existedUser.email, refreshToken);

    res.set('Authorization', `Bearer ${accessToken}`);

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    const { password: p, refreshToken: r, ...restUser } = existedUser;

    res.status(200).json({
      user: restUser,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     description: 사용자의 액세스 토큰과 리프레시 토큰을 제거하여 로그아웃합니다.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # JWT 인증 필요 명시
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그아웃 완료
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: 인증이 필요합니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: 로그아웃 처리 중 오류 발생
 */

// 쿠키에서 refreshToken 제거 위해 로그아웃 API 추가
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    // accessToken도 제거
    res.clearCookie('accessToken', {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: '로그아웃 완료' });
  } catch (err) {
    next({ statusCode: 500, message: '로그아웃 처리 중 오류 발생' });
  }
};

export default {
  signup,
  login,
  logout,
};
