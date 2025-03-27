<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
=======
import { NextFunction, Request, Response } from "express";
>>>>>>> develop

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
<<<<<<< HEAD
) => Promise<void>;
=======
) => Promise<void>;
>>>>>>> develop
