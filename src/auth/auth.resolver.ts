import { HttpStatus, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { providers, users } from '@prisma/client';
import { AuthType } from 'common/enums/auth-type.enum';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { CurrentUser } from './decorator/currentUser.decorator';
import { AuthInput } from './dto/auth-input.dto';
import { AuthPhoneResponse } from './dto/auth-phone-response.dto';
import { authPhoneDto } from './dto/auth-phone.dto';
import { AuthResponse, RenewTokenResponse } from './dto/auth-response.dto';
import { SocialAuthInput } from './dto/social-auth-input.dto';
import { validateOtpDto } from './dto/verify-otp.dto';
import { AuthDbService } from '../db/auth/auth-db.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private authDbService: AuthDbService
  ) {}

  @Mutation(() => AuthResponse)
  @Auth(AuthType.NONE)
  /**
   * Log in a user using email and password.
   * @param authData - Object containing email and password.
   * @returns An AuthResponse object with the authenticateUser result.
   * @throws UnauthorizedException if the user credentials are invalid.
   */
  async authenticateUser(@Args('authData') authData: AuthInput): Promise<AuthResponse> {
    const { email, password } = authData;
    // Validate the user using the email and password.
    const user = await this.authService.validateUser(email, password);

    // Throw an error if the user is not valid.
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const data = await this.authService.authenticateUser(user);

    // Return the validated user.
    return {
      message: 'User logged In successfully',
      statusCode: HttpStatus.OK,
      status: 'Success',
      data: data,
    };
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.NONE)
  /**
   * Sign up a user using email authentication.
   *
   * @param authData - The authentication data provided by the user.
   * @returns The authentication response.
   */
  async registerUser(@Args('authData') authData: AuthInput): Promise<AuthResponse> {
    await this.authService.registerUser(authData);
    return {
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
      status: 'Success',
    };
  }

  @Mutation(() => RenewTokenResponse)
  @Auth(AuthType.GRAPHQL_REFRESH)
  /**
   * Refreshes the token for the current user.
   * @param user - The current user.
   * @returns An AuthResponse object with the refreshed token.
   * @throws UnauthorizedException if the token is invalid.
   */
  async renewAccessToken(@CurrentUser() user: users): Promise<RenewTokenResponse> {
    try {
      // Check if the user has a valid email or id
      if (!user.email && !user.id) {
        throw new UnauthorizedException('Invalid token');
      }
      const dbUser = await this.authService.findUserById(user.id);
      // Refresh the token using the authService
      const data = await this.authService.renewAccessToken(dbUser);

      // Return the success response
      return {
        message: 'Token Refreshed successfully',
        statusCode: HttpStatus.OK,
        status: 'Success',
        data,
      };
    } catch (err) {
      return {
        message: err.message,
        statusCode: HttpStatus.UNAUTHORIZED,
        status: 'Failure',
        error: err,
      };
    }
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.NONE)
  /**
   * Initiates the password reset process for a user.
   *
   * @param {string} email - The email of the user.
   * @returns {Promise<AuthResponse>} The response containing the status and message.
   */
  async initiatePasswordReset(@Args('email') email: string): Promise<AuthResponse> {
    await this.authService.initiatePasswordReset(email);

    // Return a success message and status code
    return {
      message: 'Password reset process initiated. Please check your email.',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.GRAPHQL_REFRESH)
  /**
   * This function resets the user's password.
   *
   * @param user - The current user object.
   * @param newPassword - The new password to set.
   * @returns An AuthResponse object with the result of the password reset.
   */
  async completePasswordReset(
    @CurrentUser() user: users,
    @Args('newPassword') newPassword: string
  ): Promise<AuthResponse> {
    // Log the current user

    // Check if the user has a valid email or id
    if (!user.email && !user.id) {
      throw new UnauthorizedException('Invalid token');
    }

    // Reset the user's password
    await this.authService.completePasswordReset(newPassword, user);

    // Return a success response
    return {
      message: 'Password reset completed',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.GRAPHQL_JWT)
  /**
   * Send OTP to the provided phone number for the current user.
   * @param user - The current user.
   * @param phone_no - The phone number to send the OTP to.
   * @returns - An object containing the response message, status code, and status.
   */
  async sendVerificationOtp(@CurrentUser() user: users, @Args('phone_no') phone_no: string): Promise<AuthResponse> {
    // Check if the user has a valid email or id
    if (!user.email && !user.id) {
      throw new UnauthorizedException('Invalid token');
    }

    // Send OTP to the provided phone number for the current user
    await this.authService.sendVerificationOtp(phone_no, user);

    // Return a success message and status code
    return {
      message: 'OTP Sent Successfully',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }
  /**
   * Mutation to send OTP to the provided phone number.
   * @param phone_no - The phone number to send the OTP to.
   * @returns An object containing the response message, status code, and status.
   */
  @Mutation(() => AuthPhoneResponse)
  @Auth(AuthType.NONE)
  async authenticateUserByPhoneNumberAndOtp(@Args('data') input: authPhoneDto): Promise<AuthResponse> {
    // Call the authService to send OTP using the provided phone number
    const data = await this.authService.sendPhoneOtp(input);

    // Return response object indicating success
    return {
      message: 'OTP Sent Successfully',
      statusCode: HttpStatus.OK,
      status: 'Successful',
      data: data,
    };
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.GRAPHQL_REFRESH)
  /**
   * Verify OTP for a user
   *
   * @param user - The current user object
   * @param data - The data object containing the phone number and OTP
   * @returns An AuthResponse object with the result of the verification
   */
  async validateOtp(@CurrentUser() user: users, @Args('data') data: validateOtpDto): Promise<AuthResponse> {
    // Check if the user has a valid email or id
    if (!user.email && !user.id) {
      throw new UnauthorizedException('Invalid token');
    }
    // Verify the OTP using the authentication service

    const verificationResult = await this.authService.validateOtp(data.phone_no, data.otp, user);
    console.log(verificationResult);
    if (verificationResult) {
      const user_details = await this.authDbService.findUserById(user.id);
      //generates token if otp is valid
      const data = await this.authService.authenticateUser(user_details);
      //delete the otp from db after successful validation
      const deleteOtp = await this.authDbService.deleteUserOtp(user.id);
      if (!deleteOtp) {
        throw new InternalServerErrorException('Internal Server Error');
      }
      // Return a success response if the OTP is valid
      return {
        message: 'OTP verified Successfully',
        statusCode: HttpStatus.OK,
        status: 'Successful',
        data,
      };
    } else {
      // Return an error response if the OTP is invalid

      return {
        message: 'Invalid OTP',
        statusCode: HttpStatus.BAD_REQUEST,
        status: 'Failure',
      };
    }
  }

  @Mutation(() => AuthResponse)
  @Auth(AuthType.NONE)
  /**
   * Verifies the token of a social authentication provider.
   *
   * @param provider - The name of the provider.
   * @param socialAuthInput - The input data for social authentication.
   * @returns The authentication response.
   */
  async verifyTokenOfSocialAuth(
    @Args('provider') provider: providers,
    @Args('socialAuthInput') socialAuthInput: SocialAuthInput
  ): Promise<AuthResponse> {
    try {
      const data = await this.authService.verifyTokenOfSocialAuth(provider, socialAuthInput);

      // Return the validated user.
      return {
        message: 'User Verified successfully',
        statusCode: HttpStatus.OK,
        status: 'Success',
        data: data,
      };
    } catch (err) {
      // Return an error response if an exception occurs
      return {
        message: err,
        statusCode: HttpStatus.UNAUTHORIZED,
        status: 'Failure',
        error: err,
      };
    }
  }

  @Query(() => String)
  healthCheck(): string {
    return 'Auth server is running';
  }
}
