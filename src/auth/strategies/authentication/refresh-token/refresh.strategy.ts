import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly configService: ConfigService) {
    const refreshJwtSecret = configService.get<string>('REFRESH_JWT_SECRET');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refreshJwtSecret,
    });
  }

  async validate(payload) {
    return {
      id: payload.sub,
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      role: payload.role,
    };
  }
}
