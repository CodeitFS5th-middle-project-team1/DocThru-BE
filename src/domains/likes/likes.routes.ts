import { Router } from 'express';
import likesController from './likes.controller';
import { verifyJWTToken } from '../../middleware/verifyJWTToken';

const router = Router({ mergeParams: true });

router.use(verifyJWTToken);

router.post('/like', likesController.postLike);
router.delete('/like', likesController.deleteLike);

export default router;
