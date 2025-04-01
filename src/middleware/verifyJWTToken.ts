import { NextFunction, Request, Response } from 'express';
import jwt from '../utils/jwt';
import AuthService from '../domains/auth/auth.service';

export const verifyJWTToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("test jwttoken middle")
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return next({ statusCode: 401, message: 'Bearer 없음.' });
    }

    const accessToken = authorization.split(' ')[1];
    const payloadAccess = jwt.verifyToken(accessToken);

    if (payloadAccess) {
      req.user = payloadAccess;
      return next();
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next({ statusCode: 401, message: 'refreshToken 없음' });
    }

    const payloadRefresh = jwt.verifyToken(refreshToken);
    if (!payloadRefresh) {
      return next({ statusCode: 401, message: 'refreshToken 만료' });
    }

    const savedRefreshToken = await AuthService.getRefreshToken(
      payloadRefresh.id
    );
    // 굳이 있어야 되나 싶음..
    if (savedRefreshToken !== refreshToken) {
      return next({ statusCode: 401, message: '저장된 refreshToken 불일치' });
    }

    const newUserInfo = {
      id: payloadRefresh.id,
      role: payloadRefresh.role,
    };

    const newAccessToken = jwt.createToken(newUserInfo, 'access');
    const newRefreshToken = jwt.createToken(newUserInfo, 'refresh');

    await AuthService.updateRefreshToken(payloadRefresh.id, newRefreshToken);

    res.set('Authorization', `Bearer ${newAccessToken}`);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    req.user = newUserInfo;
    next();
  } catch (error) {
    next({ statusCode: 500, message: '인증 처리 중 오류 발생' });
  }
};
