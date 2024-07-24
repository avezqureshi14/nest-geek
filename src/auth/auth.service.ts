import { users } from '@db/@generated/users/users.model';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { providers, user_otps } from '@prisma/client';
import { Role } from 'common/enums/roles_permissions.enum';
import { AuthInput } from './dto/auth-input.dto';
import { AuthResponseDto } from './dto/auth-output.dto';
import { AuthPhoneResponseDto } from './dto/auth-phone-response.dto';
import { authPhoneDto } from './dto/auth-phone.dto';
import { RenewTokenResponseDto } from './dto/renew-token.dto';
import { SocialAuthInput } from './dto/social-auth-input.dto';
import { UserClient } from './dto/user-type.dto';
import { HashingService } from './hashing/hashing.service';
import { Helpers } from './helpers/helpers';
import { SocialAuthHelpers } from './helpers/social-auth.helpers';
import { AuthDbService } from '../db/auth/auth-db.service';
@Injectable()
export class AuthService {
  constructor(
    private authDbService: AuthDbService,
    private helpers: Helpers,
    private hashingService: HashingService,
    private socialAuthHelpers: SocialAuthHelpers
  ) {}

  /**
   * Sign up a user with the provided authentication input.
   * @param input - The authentication input containing email and password.
   * @throws UnauthorizedException - If the user creation fails.
   */
  async registerUser(input: AuthInput): Promise<void> {
    // Validate email format
    if (!this.helpers.isValidEmail(input.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (!this.helpers.isStrongPassword(input.password)) {
      throw new BadRequestException('Weak password. Password must be strong.');
    }

    const hashedPassword = await this.hashingService.hash(input.password);
    console.log('This is hashed password', hashedPassword);
    const createdUser = await this.authDbService.createUser({
      email: input.email,
      password: hashedPassword,
      user_roles: {
        create: [{ role_id: input.role }],
      },
    });

    if (!createdUser) throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Validate a user's credentials.
   * @param {string} email - The username of the user.
   * @param {string} pass - The password of the user.
   * @returns {Promise<any>} - The user object without the password if the credentials are valid, otherwise null.
   */
  async validateUser(email: string, pass: string): Promise<UserClient> {
    // Find the user with the given email
    const user = await this.authDbService.findUserByEmail(email);
    // Check if user exists and the password is correct
    if (user?.password) {
      // Destructure the password field from the user object
      const { password, ...result } = user;
      // Compare the provided password with the hashed password
      const isMatch = await this.hashingService.compare(pass, password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Return the user object without the password field
      return result;
    }
    // Throw error if the credentials are invalid
    throw new NotFoundException('User with this email not found');
  }

  /**
   * Find User By email
   * @param {string} email - The username of the user.
   * @returns {Promise<any>} - The user object without the password if the credentials are valid, otherwise null.
   */
  async findUserByEmail(email: string) {
    // Find the user with the given email
    const user = await this.authDbService.findUserByEmail(email);
    // Check if user exists and the password is correct
    if (user) {
      // Destructure the password field from the user object
      // Return the user object without the password field
      return user;
    }
    // Throw error if the credentials are invalid
    throw new NotFoundException('User with this email not found');
  }

  /**
   * Find User By email
   * @param {string} id - The username of the user.
   * @returns {Promise<any>} - The user object without the password if the credentials are valid, otherwise null.
   */
  async findUserById(id: string) {
    // Find the user with the given email
    const user = await this.authDbService.findUserById(id);
    // Check if user exists and the password is correct
    if (user) {
      // Destructure the password field from the user object
      // Return the user object without the password field
      return user;
    }
    // Throw error if the credentials are invalid
    throw new NotFoundException('User with this email not found');
  }

  /**
   * Logs in a user and returns an authentication response.
   * @param user - The user to be logged in.
   * @returns The authentication response.
   */
  async authenticateUser(user: UserClient): Promise<AuthResponseDto> {
    const response = await this.createTokenResponse(user);

    return response;
  }

  /**
   * Refreshes the access token for a user.
   *
   * @param user - The user object.
   * @returns The authentication response DTO with the new access token.
   */
  async renewAccessToken(user: users): Promise<RenewTokenResponseDto> {
    // Generate a new access token for the user

    const accessToken = await this.helpers.generateAuthToken(user);
    // Create and return the authentication response DTO

    return {
      accessToken: accessToken,
    };
  }

  /**
   * Sends a reset password email to the user with the given email.
   *
   * @param email - The email of the user.
   * @throws BadRequestException if the email is empty.
   * @throws NotFoundException if the user with the given email does not exist.
   */
  async initiatePasswordReset(email: string) {
    // Email Validation
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    // Find the user with the given email
    const user: users = await this.authDbService.findUserByEmail(email);
    // If user creation fails, throw an NotFoundException
    if (!user || !user.id) {
      throw new NotFoundException('User with this email does not exist');
    }
    const token = await this.helpers.createTempToken(user.id, user.email, user.user_roles[0].roles.name);
    this.helpers.sendcompletePasswordResetEmail(user.email, token); // send the email with the token
  }

  /**
   * Resets the user's password.
   * @param newPassword - The new password to set for the user.
   * @param user - The user object.
   */
  async completePasswordReset(newPassword: string, user: users) {
    // Hash the new password

    const hashedPassword = await this.hashingService.hash(newPassword);

    // Update the user in the database with the new password

    await this.authDbService.updateUserById(user.id, {
      password: hashedPassword,
    });
  }

  /**
   * Sends an OTP to the provided phone number for user verification.
   * @param phone_no - The phone number to send the OTP to.
   * @param user - The user object.
   */
  async sendVerificationOtp(phone_no: string, user: users) {
    // Find the user with the given email
    const fetchedUser = await this.authDbService.findUserByEmail(user.email);

    // If user creation fails, throw a NotFoundException
    if (!fetchedUser || !fetchedUser.id) {
      throw new NotFoundException('User with this email does not exist');
    }

    const otp = this.helpers.generateOtp();

    console.log('This is the otp', otp);

    // Upsert the user OTP
    await this.authDbService.upsertUserOtp(fetchedUser.id, otp, 'phone_verify');

    // TODO: Send OTP using OTP service
    console.log('Sending OTP: ', otp);
  }
  /**
   * Creates a user if not exists with the provided phone number.
   * @param phone_number - The phone number of the user.
   * @throws UnauthorizedException - If the user creation fails.
   */
  async sendPhoneOtp(authPhoneDto: authPhoneDto): Promise<AuthPhoneResponseDto> {
    try {
      // Validate phone_number format
      if (!this.helpers.isValidPhoneNumber(authPhoneDto.phone_number)) {
        throw new BadRequestException('Invalid phone number format.');
      }

      // check and retrieve if user with phone number exists
      let fetchedUser: users = await this.authDbService.findUserByPhone(authPhoneDto.phone_number);

      // If user doesn't exist or doesn't have an ID, proceed with user creation
      if (!fetchedUser || !fetchedUser.id) {
        // Validate the role provided
        if (!authPhoneDto.role || !Object.values(Role).includes(authPhoneDto.role)) {
          throw new BadRequestException('Invalid role.');
        }
        // If user doesn't exist, create a new user
        fetchedUser = await this.authDbService.createUser({
          phone_number: authPhoneDto.phone_number,
          user_roles: {
            create: [{ role_id: authPhoneDto.role }],
          },
        });
      }
      const roles = fetchedUser.user_roles.map((role) => role.role_id);
      if (!roles.includes(authPhoneDto.role)) {
        throw new BadRequestException('Provided role ID does not exist for the user.');
      }
      // Generate OTP for phone verification
      const otp = this.helpers.generateOtp();
      console.log('This is the otp', otp);

      // Upsert the OTP for phone authentication and verification
      await this.authDbService.upsertUserOtp(fetchedUser.id, otp, 'phone_authentication');
      // creates a temporary token
      const accessToken = await this.helpers.createTempToken(
        fetchedUser.id,
        fetchedUser.email,
        fetchedUser.user_roles[0].roles.name
      );
      // Create the AuthPhoneResponseDto response object
      const response = new AuthPhoneResponseDto();
      response.accessToken = accessToken;
      return response;
    } catch (error) {
      console.log('Send phone otp error:', error);
      throw error;
    }
  }

  /**
   * Verifies the OTP for a given phone number and user.
   *
   * @param phoneNumber - The phone number to verify.
   * @param otp - The OTP to verify.
   * @param user - The user object.
   * @returns True if the OTP is verified, false otherwise.
   */
  async validateOtp(phoneNumber: string, otp: string, user: users): Promise<boolean> {
    // Get the user OTP data from the database

    const otpData: user_otps = await this.authDbService.findUserOtpByUserId(user.id);
    // Throw an exception if the OTP data does not exist

    if (!otpData) {
      throw new NotFoundException('OTP does not exists ');
    }

    // Verify the OTP value
    if (otpData.otp_value != otp) {
      return false;
    }

    // Return true if the OTP is verified

    return true;
  }

  /**
   * Log in using Google authentication.
   *
   * @param req - The request object containing the user information.
   * @throws NotFoundException - Thrown if the user does not exist.
   * @returns The result of the authenticateUser or creation of the user.
   */
  async socialLoginViaPassport(req: any, provider: providers) {
    // Check if the user exists
    if (!req || !req.user) {
      throw new BadRequestException('Invalid request');
    }

    // Log in or create the user for social authentication
    return await this.loginOrCreateUserForSocial(req.user, provider);
  }

  /**
   * Login or create a new user for social authentication.
   *
   * @param user - The user object containing email, first name, last name, and avatar.
   * @returns The authentication response object.
   */
  private async loginOrCreateUserForSocial(user: any, provider: providers): Promise<AuthResponseDto> {
    const { email, first_name, last_name, avatar } = user;

    // Check if the user already exists in the database
    let dbUser: users;
    dbUser = await this.authDbService.findUserByEmail(email);

    // If the user does not exist, create a new user in the database
    if (!dbUser?.email) {
      // Generate a new password for the user
      const generatedPassword = this.socialAuthHelpers.passwordGenerator();
      const hashedPassword = await this.hashingService.hash(generatedPassword);

      // Create a new user in the database with the hashed password and other details
      dbUser = await this.authDbService.createUser({
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        avatar: avatar,
      });
    }

    // Check if oAuthIdentities exists
    const oAuthIdentities = await this.authDbService.getOauthIdentitiesByUserAndProvider(dbUser.id, provider);

    // If OAuth does not exists create the one
    if (!oAuthIdentities) {
      await this.authDbService.createOauthIdentities({
        user_id: dbUser.id,
        provider_name: provider,
        provider_id: email,
      });
    }

    const response = await this.createTokenResponse(dbUser);
    return response;
  }

  /**
   * Verify the token of social authentication for a given provider.
   *
   * @param provider - The name of the provider (e.g. 'google', 'linkedin', 'facebook').
   * @param socialAuthInput - The social authentication input containing email, name, img_url, and token.
   * @returns The authentication response DTO.
   * @throws UnauthorizedException if the user cannot be verified.
   */
  async verifyTokenOfSocialAuth(provider: providers, socialAuthInput: SocialAuthInput): Promise<AuthResponseDto> {
    // Destructure the social authentication input
    const { email, name, image_url, token } = socialAuthInput;
    console.log('This is token', token, socialAuthInput);
    try {
      let isUserVerified: boolean = false;

      // Perform the appropriate social authentication based on the provider
      switch (provider.toLowerCase()) {
        case 'google':
          isUserVerified = await this.socialAuthHelpers.googleAuth(token);
          break;
        case 'linkedin':
          isUserVerified = await this.socialAuthHelpers.linkedinAuth(token);
          break;
        case 'facebook':
          isUserVerified = await this.socialAuthHelpers.facebookAuth(token);
          break;
      }
      // Throw an exception if the user is not verified
      if (!isUserVerified) {
        throw new UnauthorizedException('User cannot be verified');
      }

      // Log in or create the user for social authentication
      return await this.loginOrCreateUserForSocial(
        {
          email: email,
          first_name: name,
          last_name: '',
          avatar: image_url,
        },
        provider
      );
    } catch (error) {
      console.log('Here is the error:', error);
      // Rethrow the error
      throw error;
    }
  }

  /**
   * Unlink the specified OAuth provider from the user.
   *
   * @param provider - The OAuth provider to unlink.
   * @param user - The user object.
   * @returns True if the unlinking was successful, false otherwise.
   */
  async unlinkOAuthProvider(provider: providers, user: any) {
    // Delete the OAuth identities associated with the user and provider

    await this.authDbService.deleteOauthIdentitiesByUserAndProvider(user.id, provider);

    // Return true to indicate successful unlinking
    return true;
  }

  private async createTokenResponse(user: any) {
    // Generate the access token for the user
    const accessToken = await this.helpers.generateAuthToken(user);

    // Generate the refresh token for the user
    const renewAccessToken = await this.helpers.generateRefreshToken(user);

    // Set the reset token expiry date to 30 days from now
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setDate(resetTokenExpiry.getDate() + 30);

    // Update the user in the database with the reset token and reset token expiry
    await this.authDbService.updateUserById(user.id, {
      reset_token: renewAccessToken,
      reset_token_expiry: resetTokenExpiry,
    });

    // Create the authentication response object
    const response = this.helpers.createAuthResponseObject(accessToken, renewAccessToken, user);

    return response;
  }
}
