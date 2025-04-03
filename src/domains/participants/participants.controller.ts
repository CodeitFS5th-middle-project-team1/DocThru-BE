import { GetController } from "../../types/express";
import ParticipantsService from "./participants.service";
import { ParticipantsRequestParams, ParticipantsRequestQueries } from "./participants.validation";

const getParticipants: GetController<ParticipantsRequestParams, ParticipantsRequestQueries, any> = async (req , res , next) => {
  try {
    const id = req.params.challengeId;
    const { limit, page } = req.query;
    const result = await ParticipantsService.getParticipants({id, page, limit});
    res.status(200).send(result)
  } catch (err) {
    next(err);
  }
}

const ParticipantsController = {
  getParticipants,
}

export default ParticipantsController;