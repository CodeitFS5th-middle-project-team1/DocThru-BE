import { Router } from "express";
import TranslationRouter from '../translations/translations.routes';

const router = Router();

router.get("/",(req, res) => console.log("test")); //챌린지
router.post("/"); //챌린지 신청
router.use("/:challengeId/translations", TranslationRouter);
export default router;