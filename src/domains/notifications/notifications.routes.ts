import { Router } from 'express';
import {
  getNotifications,
  createNotificationHandler,
} from './notifications.controller';

const router = Router();

router.get('/', getNotifications); // 알림 조회
router.post('/', createNotificationHandler); // 알림 생성
export default router;
