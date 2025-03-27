import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

router.post('/signup', authController.signup); //회원가입
router.post('/login', authController.login); //로그인
router.post('/logout'); //로그아웃

export default router;
