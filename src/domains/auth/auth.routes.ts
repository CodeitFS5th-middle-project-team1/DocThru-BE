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
import { verifyJWTToken } from '../../middleware/verifyJWTToken';

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

router.post('/logout', authController.logout); //로그아웃

export default router;
