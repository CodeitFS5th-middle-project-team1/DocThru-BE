import { NextFunction, Request, Response, Router } from 'express';
import authController from './auth.controller';
import { ZodSchema } from 'zod';
import {
  LoginBodySchema,
  SignUpBodySchema,
  testBodySchema,
  testParamsSchema,
  testQueriesSchema,
} from './auth.types';
import { validateRequestData } from '../../middleware/validateRequestData';

const router = Router();

router.post(
  '/signup',
  validateRequestData({ body: SignUpBodySchema }),
  authController.signup
); // 회원가입

router.post(
  '/login',
  validateRequestData({ body: LoginBodySchema }),
  authController.login
); // 로그인

router.post('/logout'); //로그아웃

// TODO: 테스트 용 api, 삭제 예정
router.post(
  '/test/:id/:params2',
  validateRequestData({
    params: testParamsSchema,
    query: testQueriesSchema,
    body: testBodySchema,
  }),
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    console.log(req.query);
    const { email, password } = req.body;
    res.send('hello');
  }
);

export default router;
