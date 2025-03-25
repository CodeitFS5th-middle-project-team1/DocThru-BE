import { Router } from 'express';

const router = Router();

router.post('signup'); //회원가입
router.post('login'); //로그인
router.post('logout'); //로그아웃

export default router;
