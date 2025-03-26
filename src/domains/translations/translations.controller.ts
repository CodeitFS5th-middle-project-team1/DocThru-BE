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
    console.log('🔥 req.params:', req.params);
    const { challengeId } = req.params;

    if (!challengeId) {
      return next({ statusCode: 400, message: 'challengeId가 필요합니다.' });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return next({ statusCode: 404 });
    }

    const translations = await TranslationsService.getTranslations(challengeId);

    res.status(200).json({
      success: true,
      data: translations,
    });
  } catch (err) {
    next(err);
  }
};

const TranslationsController = {
  getTranslations,
};

export default TranslationsController;
