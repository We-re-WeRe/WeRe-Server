import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
import { Payload } from './dto/jwt.dto';

const SECRET_KEY_TYPE = {
  REFRESH: 'REFRESH_SECRET_KEY',
  ACCESS: 'ACCESS_SECRET_KEY',
};

/**
 * 가드에서는 가드의 역할만 해주자!
 * 인증의 결과로 가드 통과 여부만 처리.
 * 토큰 재발급 필요 여부랑 완전 만료 여부만 처리.
 *
 */
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
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      if (isPublic) return true;
      else throw new CustomUnauthorziedException('Token is unvalid.');
    }
    const payload = await this.getPayloadFromToken(token, context);
    request['userId'] = payload.userId;
    return true;
  }

  /**
   * get Payload from token.
   * @param token
   * @param isPublic
   * @param context
   * @returns
   */
  public async getPayloadFromToken(
    token: string,
    context: ExecutionContext,
  ): Promise<Payload> {
    const isRefreshRequired = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_REQUIRED,
      [context.getHandler(), context.getClass()],
    );
    const secretKeyType = this.getSecretKeyType(isRefreshRequired);
    try {
      const payload = await this.jwtService.verifyAsync<Payload>(token, {
        secret: this.configService.get<string>(secretKeyType),
      });
      if (isRefreshRequired)
        await this.checkRefreshTokenWithDatabase(token, payload.userId);
      return payload;
    } catch {
      throw new CustomUnauthorziedException('Token is unvalid.');
    }
  }

  /**
   * extract token from header
   * @param request
   * @returns
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * get secretKeyType with isRefreshRequired boolean
   * @param isRefreshRequired
   * @returns
   */
  private getSecretKeyType(isRefreshRequired: boolean): string {
    const secretKeyType = isRefreshRequired
      ? SECRET_KEY_TYPE.REFRESH
      : SECRET_KEY_TYPE.ACCESS;
    return secretKeyType;
  }

  /**
   * check refresh token is valid by comparing with Database saved refresh token.
   * @param token
   * @param userId
   * @returns
   */
  private async checkRefreshTokenWithDatabase(
    token: string,
    userId: number,
  ): Promise<boolean> {
    const savedRefreshToken = await this.authService.getRefreshTokenByUserId(
      userId,
    );
    if (token !== savedRefreshToken)
      throw new CustomUnauthorziedException('Token is unvalid');

    return true;
  }
}
