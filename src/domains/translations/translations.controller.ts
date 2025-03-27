import { Controller } from '../../types/express';
import TranslationsService from './translations.service';

const getTranslations: Controller = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const page = parseInt(req.query.page as string) || 1;

    if (!challengeId) {
      return next({ statusCode: 400 });
    }

    const { translations, totalCount } =
      await TranslationsService.getTranslations(challengeId, page);

    res.status(200).json({
      success: true,
      data: translations,
      totalCount,
    });
  } catch (err) {
    next(err);
  }
};

const TranslationsController = {
  getTranslations,
};

export default TranslationsController;
