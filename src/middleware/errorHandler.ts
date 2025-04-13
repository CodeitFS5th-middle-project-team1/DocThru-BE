import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import CustomError from '../types/error';

const errorHandler: ErrorRequestHandler = (
  err: CustomError & { status?: number; name?: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode === 500) console.error(err.stack);

  const message = err.message;

  if (statusCode === 400) {
    res.status(statusCode).json({
      code: statusCode,
      message: message || '잘못된 요청입니다.\n요청이 올바른 형식이 아닙니다.',
    });
    return;
  }

  if (statusCode === 401) {
    res.status(statusCode).json({
      code: statusCode,
      message: message || '인증이 필요합니다.\n유효한 인증 정보가 없습니다.',
    });
    return;
  }

  if (statusCode === 403) {
    res.status(statusCode).json({
      code: statusCode,
      message: message || '요청이 거부되었습니다.\n접근 권한이 없습니다.',
    });
    return;
  }

  if (statusCode === 404) {
    res.status(statusCode).json({
      code: statusCode,
      message: message || '요청한 리소스를\n찾을 수 없습니다.',
    });
    return;
  }
  //액세스 + 리프레시 토큰 관련 커스텀
  if (statusCode === 419) {
    return res.status(statusCode).json({
      code: statusCode,
      message: message || '세션이 만료되었습니다. 다시 로그인해주세요.',
    });
  }

  res.status(statusCode).json({
    code: statusCode,
    message: err.message || '서버 내부 오류 발생!!',
  });
};

export default errorHandler;
