import { Request, Response, NextFunction } from 'express';

export type Controller<P, Q, B, D> = (
  req: Request<P, Q, B>,
  res: Response<D>,
  next: NextFunction
) => Promise<void>;