import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  res.send({ message: 'users' });
});
export default router;
