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
    const isPublic = this.getBooleanFromMetaData(IS_PUBLIC_KEY, context);
    const isRefreshRequired = this.getBooleanFromMetaData(
      IS_REFRESH_REQUIRED,
      context,
    );
    const request = context.switchToHttp().getRequest();

    const token = this.extractToken(request, isRefreshRequired);

    if (!token) {
      if (isPublic) return true;
      else throw new CustomUnauthorziedException('Token is unvalid.');
    }

    const payload = await this.getPayloadFromToken(token, isRefreshRequired);
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
    isRefreshRequired: boolean,
  ): Promise<Payload> {
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
   * get boolean from metadata like public and isRefresh
   * @param key
   * @param context
   * @returns
   */
  private getBooleanFromMetaData(key: string, context: ExecutionContext) {
    return this.reflector.getAllAndOverride<boolean>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
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

  /**
   * assemble token extract functions
   * @param request
   * @param isRefreshRequired
   * @returns
   */
  private extractToken(
    request: Request,
    isRefreshRequired: boolean,
  ): string | undefined {
    if (isRefreshRequired) return this.extractRefreshToken(request);
    else return this.extractAccessToken(request);
  }

  /**
   * extract refresh token from cookie
   * @param request
   * @returns
   */
  private extractRefreshToken(request: Request): string | undefined {
    const token = request.cookies['refreshToken'];
    return token ?? undefined;
  }

  /**
   * extract access token from header
   * @param request
   * @returns
   */
  private extractAccessToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
