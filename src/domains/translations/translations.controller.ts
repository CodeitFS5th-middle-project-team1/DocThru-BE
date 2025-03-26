import { Router } from 'express';
import TranslationsService from './translations.service';
import { Controller } from '../../types/express';
import prisma from '../../prismaClient';
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Translation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         challengeId:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         likeCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/challenges/{challengeId}/translations:
 *   get:
 *     summary: 특정 챌린지의 번역 목록 조회
 *     tags:
 *       - Translations
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         description: 챌린지 ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: 페이지 번호 (기본값 1)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 번역 목록 응답
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Translation'
 *                 totalCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 챌린지를 찾을 수 없음
 */

const getTranslations: Controller = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;

    // if (!challengeId) {
    //   return next({ statusCode: 400 });
    // }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return next({ statusCode: 404 });
    }

    const { translations, totalCount } =
      await TranslationsService.getTranslations(challengeId, page);

    res.status(200).json({
      success: true,
      data: translations,
      totalCount, // ✅ 전체 개수 -> 프론트 페이지네이션에 사용
    });
  } catch (err) {
    next(err);
  }
};

const TranslationsController = {
  getTranslations,
};

export default TranslationsController;
