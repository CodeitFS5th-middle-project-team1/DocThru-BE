import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';

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

export default {
  signup,
};
