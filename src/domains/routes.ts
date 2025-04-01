import { Router } from 'express';
import AuthRouter from './auth/auth.routes';
import ChallengeRouter from './challenges/challenges.routes';
import FeedbackRouter from './feedbacks/feedbacks.routes';
import NotificationRouter from './notifications/notifications.routes';
import LikeRouter from './likes/likes.routes';
import TranslationRouter from './translations/translations.routes';
import UserRouter from './users/users.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send({ message: 'hi' });
});
router.use('/auth', AuthRouter);
router.use('/challenges', ChallengeRouter);
router.use('/translations/:translationId/feedbacks', FeedbackRouter);
router.use('/notification', NotificationRouter);
router.use('/likes', LikeRouter);
//router.use('/translations', TranslationRouter);
router.use('/users', UserRouter);

export default router;
