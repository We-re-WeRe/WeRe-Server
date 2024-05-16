import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
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
export class AccessTokenGuard implements CanActivate {
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
    if (isPublic) return true;

    const isRefreshRequired = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_REQUIRED,
      [context.getHandler(), context.getClass()],
    );
    const secretKeyType = isRefreshRequired
      ? SECRET_KEY_TYPE.REFRESH
      : SECRET_KEY_TYPE.ACCESS;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new CustomUnauthorziedException('Token is unvalid.');
    }
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
      request['userId'] = payload.userId;
    } catch {
      throw new CustomUnauthorziedException('Token is unvalid.');
    }
    return true;
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
