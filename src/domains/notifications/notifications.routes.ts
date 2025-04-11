import { Router } from 'express';
import {
  getNotifications,
  deleteNotification,
} from './notifications.controller';
import { createNotification } from './notifications.service';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';

const router = Router();
router.use(verifyJWTToken);
router.get('/', getNotifications); // 알림 조회
router.post('/', createNotification); // 알림 생성
router.delete('/:id', deleteNotification);
export default router;
