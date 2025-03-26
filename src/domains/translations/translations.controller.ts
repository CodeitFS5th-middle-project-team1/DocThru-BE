import { Router } from 'express';
import TranslationsService from './translations.service';
import { Controller } from '../../types/express';
import prisma from '../../prismaClient';
const router = Router();

// export const getAllTranslationsController: Controller = async (
//   req,
//   res,
//   next
// ) => {
//   try {
//     const translations = await getAllTranslations();

//     res.status(200).json({
//       success: true,
//       data: translations,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getTranslations: Controller = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;

    if (!challengeId) {
      return next({ statusCode: 400 });
    }

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
