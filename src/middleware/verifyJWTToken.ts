import { NextFunction, Request, Response } from 'express';
import jwt from '../utils/jwt';
import AuthService from '../domains/auth/auth.service';

export const verifyJWTToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken: string | undefined;

    // 헤더에서 토큰 확인
    const authorization = req.headers.authorization;
    if (authorization?.startsWith('Bearer ')) {
      accessToken = authorization.split(' ')[1];
    }

    // 쿠키에서 토큰 확인 (헤더에 없는 경우)
    if (!accessToken && req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    // 토큰이 없는 경우
    if (!accessToken) {
      return next({ statusCode: 401, message: '액세스 토큰이 없습니다.' });
    }

    //액세스 토큰 검증
    const payloadAccess = jwt.verifyToken(accessToken, 'access');
    if (payloadAccess) {
      req.user = payloadAccess;
      return next();
    }

    // 액세스 토큰이 만료되면 리프레시 토큰으로 갱신
    const refreshToken = req.cookies?.refreshToken;
    //token이 갱신 되지 않으면 쿠키에 있는 token을 삭제
    if (!refreshToken) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return next({
        statusCode: 419,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    }
    // 리프레시 토큰 만료
    const payloadRefresh = jwt.verifyToken(refreshToken, 'refresh');
    if (!payloadRefresh) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return next({
        statusCode: 419,
        message: '세션이 만료되었습니다. 다시 로그인해주세요.',
      });
    }

    // // 저장된 리프레시 토큰과 다를 경우 (위변조 가능성)
    // 로그인상태에서 서버 다운되면
    // - 보안 측면에서는 좋지만, ux적으로 좋지 않을거같아서 일단 주석처리
    // const savedRefreshToken = await AuthService.getRefreshToken(
    //   payloadRefresh.id
    // );
    // if (savedRefreshToken !== refreshToken) {
    //   res.clearCookie('accessToken');
    //   res.clearCookie('refreshToken');
    //   return next({
    //     statusCode: 403,
    //     message: '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
    //   });
    // }

    // 새 토큰 발급
    const newUserInfo = {
      id: payloadRefresh.id,
      role: payloadRefresh.role,
    };

    const newAccessToken = jwt.createToken(newUserInfo, 'access');
    const newRefreshToken = jwt.createToken(newUserInfo, 'refresh');

    await AuthService.updateRefreshToken(payloadRefresh.id, newRefreshToken);

    // 헤더에 새 액세스 토큰 설정
    res.set('Authorization', `Bearer ${newAccessToken}`);

    // 쿠키 설정
    res.cookie('accessToken', newAccessToken, {
      httpOnly: false, // 프론트엔드에서 접근 가능하게 false
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: 'https://doc-thru-fe.vercel.app/'
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, // JS에서 접근 불가
      sameSite: 'none',
      secure: true,
      domain: 'https://doc-thru-fe.vercel.app/'
    });

    req.user = newUserInfo;
    next();
  } catch (error) {
    console.error('JWT 검증 오류:', error);
    next({ statusCode: 500, message: '인증 처리 중 오류가 발생했습니다.' });
  }
};
