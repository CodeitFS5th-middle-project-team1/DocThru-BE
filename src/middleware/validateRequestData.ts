import { ZodSchema } from 'zod';
import { NextFunction, Request, Response } from 'express';

type SchemaSet = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validateRequestData =
  (schemas: SchemaSet) => (req: Request, res: Response, next: NextFunction) => {
    try {
      // Body 검증
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body);
        if (!result.success) {
          next({ statusCode: 400, message: result.error.flatten() });
          return;
        }
        req.body = result.data;
      }

      // Query 검증
      if (schemas.query) {
        const result = schemas.query.safeParse(req.query);
        if (!result.success) {
          next({ statusCode: 400, message: result.error.flatten() });
          return;
        }
        req.query = result.data;
      }

      // Params 검증
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params);
        if (!result.success) {
          next({ statusCode: 400, message: result.error.flatten() });
          return;
        }
        req.params = result.data;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
