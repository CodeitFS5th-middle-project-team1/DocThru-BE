import { GetController } from '../../types/express';
import { GetFeedBackListParams } from './feedbacks.validation';
import FeedbackService from './feedbacks.service';
import { GetFeedbackListResponse } from './feedbacks.type';

const getFeedBackList: GetController<
  GetFeedBackListParams,
  never,
  GetFeedbackListResponse
> = async (req, res, next) => {
  const translationId = req.params.translationId;

  const existedTranslaition = await FeedbackService.checkTranslations(
    translationId
  );

  if (!existedTranslaition) {
    return next({ statusCode: 400, message: '존재하지 않는 translationId' });
  }

  const feedbacks = await FeedbackService.fetchFeedbackList(
    existedTranslaition.id
  );

  res.status(200).json({
    feedbacks: feedbacks,
  });
  return;
};

export default {
  getFeedBackList,
};
