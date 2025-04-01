import { Router } from 'express';
import { ParticipantsParamsSchema, ParticipantsQueriesSchema } from './participants.validation';
import { validateRequestData } from '../../middleware/validateRequestData';
import ParticipantsController from './participants.controller';

const router = Router({ mergeParams: true });
router.get('/', validateRequestData({ params: ParticipantsParamsSchema }), ParticipantsController.getParticipants); // 챌린지 참여자 조회
router.post('/'); // 챌린지 참여하기
router.delete('/'); // 챌린지 참여 포기
export default router;
