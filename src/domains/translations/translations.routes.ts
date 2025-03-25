import { Router } from "express";

const router = Router();

router.get("/") // 작업물 목록
router.post("/") // 작업물 생성
router.patch("/:translationId") // 작업물 수정
router.delete("/:translationId") // 작업물 삭제

export default router;