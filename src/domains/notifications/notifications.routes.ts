import { Router } from 'express';
import { getNotifications } from './notifications.controller';

const router = Router();

router.get('/', getNotifications); // 알림 생성

export default router;
