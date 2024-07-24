import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * This is the constructor for the AuthController class.
   * @param authService - An instance of the AuthService class.
   */
  constructor(private authService: AuthService) {
    super({
      // Set the username field to 'email'
      usernameField: 'email',
      // Set the password field to 'password'
      passwordField: 'password',
    });
  }

  /**
   * Validates the given email and password.
   * Throws an error if the user is not valid.
   * @param email - The email to validate.
   * @param password - The password to validate.
   * @returns The validated user.
   */
  async validate(email: string, password: string): Promise<any> {
    // Validate the user using the email and password.
    const user = await this.authService.validateUser(email, password);

    // Throw an error if the user is not valid.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Return the validated user.
    return user;
  }
}
