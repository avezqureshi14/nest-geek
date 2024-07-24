import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { Helpers } from './helpers/helpers';
import { SocialAuthHelpers } from './helpers/social-auth.helpers';
import { AuthenticationGuard } from './strategies/authentication/authentication.guard';
import { GqlAuthGuard } from './strategies/authentication/jwt-token/graphql-jwt-auth.guard';
import { JwtAuthGuard } from './strategies/authentication/jwt-token/jwt-auth.guard';
import { JwtStrategy } from './strategies/authentication/jwt-token/jwt.strategy';
import { LocalStrategy } from './strategies/authentication/local/local.strategy';
import { GqlRefreshGuard } from './strategies/authentication/refresh-token/graphql-refresh-auth.guard';
import { RefreshAuthGuard } from './strategies/authentication/refresh-token/refresh-auth.guard';
import { RefreshStrategy } from './strategies/authentication/refresh-token/refresh.strategy';
import { FacebookStrategy } from './strategies/social-auth/facebook/facebook.strategy';
import { GoogleStrategy } from './strategies/social-auth/google/google.strategy';
import { LinkedInStrategy } from './strategies/social-auth/linkedIn/linkedIn.strategy';
import { DBModule } from '../db/db.module';

@Module({
  imports: [DBModule, PassportModule, ConfigModule, JwtModule.register({})],
  providers: [
    AuthService,
    LocalStrategy,
    AuthResolver,
    JwtStrategy,
    Helpers,
    RefreshStrategy,
    GoogleStrategy,
    SocialAuthHelpers,
    FacebookStrategy,
    LinkedInStrategy,
    JwtAuthGuard,
    GqlAuthGuard,
    GqlRefreshGuard,
    RefreshAuthGuard,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
