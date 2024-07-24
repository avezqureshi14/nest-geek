// src/auth/linkedin-auth/linkedin.strategy.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_emailaddress', 'r_liteprofile'], // Adjust the required permissions as needed
    });
  }

  async validate(accessToken: string, renewAccessToken: string, profile: any, done: any) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      avatar: photos[0].value,
      accessToken,
      renewAccessToken,
    };
    done(null, user);
  }
}
