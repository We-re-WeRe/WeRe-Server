import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  IS_PUBLIC_KEY,
  IS_REFRESH_REQUIRED,
} from 'src/utils/custom_decorators';
import { CustomUnauthorziedException } from 'src/utils/custom_exceptions';
import { AuthService } from './auth.service';

const SECRET_KEY_TYPE = {
  REFRESH: 'REFRESH_SECRET_KEY',
  ACCESS: 'ACCESS_SECRET_KEY',
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    request['userId'] = -1;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) return true;
      else throw new CustomUnauthorziedException('Token is unvalid.');
    }
    const payload = await this.getPayloadFromToken(token, isPublic, context);
    if (payload) request['userId'] = payload.userId;
    return true;
  }

  public async getPayloadFromToken(
    token: string,
    isPublic: boolean,
    context: ExecutionContext,
  ) {
    const isRefreshRequired = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_REQUIRED,
      [context.getHandler(), context.getClass()],
    );
    const secretKeyType = isRefreshRequired
      ? SECRET_KEY_TYPE.REFRESH
      : SECRET_KEY_TYPE.ACCESS;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(secretKeyType),
      });
      if (isRefreshRequired) {
        const savedRefreshToken =
          await this.authService.getRefreshTokenByUserId(payload.userId);
        if (token !== savedRefreshToken)
          throw new CustomUnauthorziedException('Token is unvalid');
      }
      return payload;
    } catch {
      if (isPublic) {
        const res = context.switchToHttp().getResponse<Response>();
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return undefined;
      } else throw new CustomUnauthorziedException('Token is unvalid.');
    }
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
