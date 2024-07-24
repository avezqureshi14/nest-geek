import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';
import { Helpers } from './helpers';

@Injectable()
export class SocialAuthHelpers {
  constructor(
    private helpers: Helpers,
    private config: ConfigService
  ) {}

  passwordGenerator(len?: number) {
    const length = len || 10;
    const string = 'abcdefghijklmnopqrstuvwxyz'; //to upper
    const numeric = '0123456789';
    const punctuation = '!@#$%&*';
    let password = '';
    let character = '';
    while (password.length < length) {
      const entity1 = Math.ceil(string.length * Math.random() * Math.random());
      const entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
      const entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
      let hold = string.charAt(entity1);
      hold = password.length % 2 == 0 ? hold.toUpperCase() : hold;
      character += hold;
      character += numeric.charAt(entity2);
      character += punctuation.charAt(entity3);
      password = character;
    }
    password = password
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
    return password.substring(0, len);
  }

  /**
   * Verify the Google id_token.
   *
   * @param {string} token - The id_token to be verified.
   * @returns {boolean} - True if the email is verified, false otherwise.
   */
  async googleAuth(token: string) {
    // Create a new OAuth2Client instance with the Google client ID.
    console.log('This is google', process.env.GOOGLE_CLIENT_ID, token);
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the id_token using the client.

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get the payload from the ticket.

    const payload = ticket.getPayload();

    // Check if the email is verified.

    const isEmailVerified = payload['email_verified'];

    // Return whether the email is verified or not.
    return isEmailVerified;
  }

  async linkedinAuth(token: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('client_id', `${process.env.LINKEDIN_CLIENT_ID}`);
    params.append('client_secret', `${process.env.LINKEDIN_CLIENT_SECRET}`);
    params.append('token', `${token}`);

    const { data: linkedinData } = await fetch(process.env.LINKEDIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
      .then((response: { json: () => any }) => response.json())
      .then((data: any) => {
        return { data };
      });

    if (!linkedinData || !linkedinData.client_id) {
      return false;
    }
    return true;
  }

  async facebookAuth(token: string): Promise<boolean> {
    const { data: facebookAppAccessToken } = await fetch(process.env.FACEBOOK_URL, {
      method: 'GET',
    })
      .then((response: { json: () => any }) => response.json())
      .then((data: any) => {
        return { data };
      });

    const { data: facebookData } = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${facebookAppAccessToken.access_token}`,
      { method: 'GET' }
    )
      .then((response: { json: () => any }) => response.json())
      .then((data: any) => {
        return { data };
      });

    if (!facebookData || !facebookData.data || !facebookData.data.app_id) {
      return false;
    }
    return true;
  }
}
