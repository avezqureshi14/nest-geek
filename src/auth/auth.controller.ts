import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { providers } from '@prisma/client';
import { AuthService } from './auth.service';
import { Auth } from './decorator/auth.decorator';
import { AuthInput } from './dto';
import { AuthResponseDto } from './dto/auth-output.dto';
import { authPhoneDto } from './dto/auth-phone.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { EmailOnlyInputDto } from './dto/email-only-input.dto';
import { RenewTokenResponseDto } from './dto/renew-token.dto';
import { completePasswordResetDto } from './dto/reset-password.dto';
import { SocialAuthInput } from './dto/social-auth-input.dto';
import { validateOtpDto } from './dto/verify-otp.dto';
import { ResponseUtil } from './helpers/response.utils';
import { LocalAuthGuard } from './strategies/authentication/local/local-auth.guard';
import { FacebookOAuthGuard } from './strategies/social-auth/facebook/facebook.guard';
import { GoogleOAuthGuard } from './strategies/social-auth/google/google.guard';
import { LinkedInOAuthGuard } from './strategies/social-auth/linkedIn/linkedIn.guard';
import { ApiResponse as Response } from '../common/dto/api-response';
import { AuthType } from '../common/enums/auth-type.enum';
import { AuthDbService } from '../db/auth/auth-db.service';

@Controller('api/v1/auth')
@ApiTags('Auth-Controller')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private authDbService: AuthDbService
  ) {}

  @Post('registerUser')
  @Auth(AuthType.NONE)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  /**
   * Sign up a user.
   *
   * @param dto - The authentication input data.
   * @returns The API response with the success message.
   */
  async registerUser(@Body() dto: AuthInput): Promise<Response<any>> {
    await this.authService.registerUser(dto);
    return ResponseUtil.success(null, 'User registered successfully');
  }

  @Post('authenticateUser')
  @Auth(AuthType.NONE)
  @UseGuards(LocalAuthGuard)
  /**
   * Logs in a user with the provided authentication data.
   * @param authData - The authentication data containing email and password.
   * @returns The result of the authenticateUser operation.
   * @throws {UnauthorizedException} If the authentication data is invalid.
   */
  async authenticateUser(@Body() _dto: AuthInput, @Request() req): Promise<Response<AuthResponseDto>> {
    const data = await this.authService.authenticateUser(req.user);
    return ResponseUtil.success(data, 'User logged in successfully');
  }

  @Post('renewAccessToken')
  @ApiBearerAuth()
  @Auth(AuthType.REFRESH)
  /**
   * Refreshes the token for an authenticated user.
   * @param req - The request object containing the authenticated user.
   * @returns An ApiResponse object with the refreshed token.
   */
  async renewAccessToken(@Request() req): Promise<Response<RenewTokenResponseDto>> {
    const data = await this.authService.renewAccessToken(req.user);
    return ResponseUtil.success(data, 'Token Refreshed successfully');
  }

  /**
   * Endpoint for initiating the password reset process.
   *
   * @param email - The email address of the user who forgot their password.
   * @returns A promise that resolves to an ApiResponse object.
   */
  @Post('initiatePasswordReset')
  @Auth(AuthType.NONE)
  async initiatePasswordReset(@Body() dto: EmailOnlyInputDto): Promise<Response<null>> {
    await this.authService.initiatePasswordReset(dto.email);

    // Return a success message and status code
    return {
      message: 'Password reset process initiated. Please check your email.',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }

  @Post('completePasswordReset')
  @Auth(AuthType.REFRESH)
  @ApiBearerAuth()
  /**
   * Reset the user's password.
   *
   * @param {Request} req - The request object.
   * @param {string} newPassword - The new password to be set.
   * @returns {object} - An object containing a success message and status code.
   */
  async completePasswordReset(@Request() req, @Body() dto: completePasswordResetDto) {
    // Call the completePasswordReset method of the authService
    await this.authService.completePasswordReset(dto.newPassword, req.user);

    // Return a success message and status code
    return {
      message: 'Password reset completed',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }

  @Post('sendVerificationOtp')
  @Auth(AuthType.JWT)
  /**
   * Sends an OTP to the provided phone number.
   * @param req - The request object.
   * @param phone_no - The phone number to send the OTP to.
   * @returns A success message and status code.
   */
  async sendVerificationOtp(@Request() req, @Body('phone_no') phone_no: string) {
    // Call the sendVerificationOtp method of the authService
    await this.authService.sendVerificationOtp(phone_no, req.user);

    // Return a success message and status code
    return {
      message: 'OTP Sent Successfully',
      statusCode: HttpStatus.OK,
      status: 'Successful',
    };
  }

  /**
   * POST endpoint to send OTP to the provided phone number.
   * @param req - The request object.
   * @param authPhoneDto - The DTO containing the phone number to send OTP to.
   * @returns An object containing the response message, status code, and status.
   */
  @Post('authenticateUserByPhoneNumberAndOtp')
  @Auth(AuthType.NONE)
  async authenticateUserByPhoneNumberAndOtp(@Request() req, @Body() authPhoneDto: authPhoneDto) {
    // Call the authService to send OTP using the provided phone number
    const data = await this.authService.sendPhoneOtp(authPhoneDto);

    // Return response object indicating success
    return {
      message: 'OTP Sent Successfully',
      statusCode: HttpStatus.OK,
      status: 'Successful',
      data: data,
    };
  }

  @Post('validateOtp')
  @Auth(AuthType.REFRESH)
  @ApiBearerAuth()
  /**
   * Verifies the OTP provided by the user.
   * @param req - The request object containing user information.
   * @param data - The data object containing the phone number and OTP.
   * @returns An ApiResponse object indicating the status of the OTP verification.
   */
  async validateOtp(@Request() req, @Body() validateOtpDto: validateOtpDto): Promise<AuthResponse> {
    // Verify the OTP using the authService
    const verificationResult = await this.authService.validateOtp(
      validateOtpDto.phone_no,
      validateOtpDto.otp,
      req.user
    );
    const user_details = await this.authDbService.findUserById(req.user.id);
    // Check if the OTP is valid
    if (verificationResult) {
      //generates token if otp is valid
      const data = await this.authService.authenticateUser(user_details);

      //delete the otp from db after successful validation
      const deleteOtp = await this.authDbService.deleteUserOtp(req.user.id);
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
      // Return error response
      throw new BadRequestException('Invalid Otp.');
    }
  }

  @Get('authenticateWithGoogle')
  @Auth(AuthType.NONE)
  @UseGuards(GoogleOAuthGuard)
  /**
   * Log the request object received from the client.
   *
   * @param req - The request object.
   */
  async authenticateWithGoogle(@Request() req) {}

  @Get('google/redirect')
  @Auth(AuthType.NONE)
  @UseGuards(GoogleOAuthGuard)
  /**
   * Redirects the user to Google authentication.
   *
   * @param req - The Request object containing the necessary information for the authentication.
   * @returns The result of the Google authenticateUser.
   */
  async googleAuthRedirect(@Request() req) {
    const data = await this.authService.socialLoginViaPassport(req, providers.Google);
    return {
      message: 'User logged in successfully',
      status: 'Success',
      data,
    };
  }

  @Get('authenticateWithFacebook')
  @Auth(AuthType.NONE)
  @UseGuards(FacebookOAuthGuard)
  /**
   * Log the request object received from the client.
   *
   * @param req - The request object.
   */
  async authenticateWithFacebook(@Request() req) {}

  @Get('facebook/redirect')
  @Auth(AuthType.NONE)
  @UseGuards(FacebookOAuthGuard)
  /**
   * Redirects the user to Facebook authentication.
   *
   * @param req - The Request object containing the necessary information for the authentication.
   * @returns The result of the Google authenticateUser.
   */
  async facebookAuthRedirect(@Request() req) {
    const data = await this.authService.socialLoginViaPassport(req, providers.Facebook);
    return {
      message: 'User logged in successfully',
      status: 'Success',
      data,
    };
  }

  @Get('authenticateWithLinkedin')
  @Auth(AuthType.NONE)
  @UseGuards(LinkedInOAuthGuard)
  /**
   * Log the request object received from the client.
   *
   * @param req - The request object.
   */
  async authenticateWithLinkedin(@Request() req) {}

  @Get('linkedin/redirect')
  @Auth(AuthType.NONE)
  @UseGuards(LinkedInOAuthGuard)
  /**
   * Redirects the user to Facebook authentication.
   *
   * @param req - The Request object containing the necessary information for the authentication.
   * @returns The result of the Google authenticateUser.
   */
  async linkedInAuthRedirect(@Request() req) {
    const data = await this.authService.socialLoginViaPassport(req, providers.LinkedIn);
    return {
      message: 'User logged in successfully',
      status: 'Success',
      data,
    };
  }

  @Post('verifyToken/:provider')
  @Auth(AuthType.NONE)
  /**
   * Verifies the token of a social authentication provider.
   *
   * @param provider - The name of the social authentication provider.
   * @param socialAuthInput - The input data for the social authentication.
   *
   * @returns An object containing the verification result and data.
   */
  async verifyTokenOfSocialAuth(@Body() socialAuthInput: SocialAuthInput, @Param('provider') provider: providers) {
    // Verify the token using the authentication service
    const data = await this.authService.verifyTokenOfSocialAuth(provider, socialAuthInput);

    // Return the verification result and data
    return {
      message: 'User Verified successfully!',
      status: 'Success',
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('unlink/oauth/:provider')
  @Auth(AuthType.JWT)
  /**
   * Unlinks an OAuth provider for the user.
   *
   * @param provider - The provider to unlink.
   * @param req - The request object.
   * @returns An object with the result of the unlink operation.
   */
  async unlinkOAuthProvider(@Param('provider') provider: providers, @Request() req: any) {
    // Call the authService to unlink the OAuth provider for the user
    await this.authService.unlinkOAuthProvider(provider, req.user);

    // Return the verification result and data
    return {
      message: 'Provider Unlinked successfully!',
      status: 'Success',
      statusCode: HttpStatus.OK,
    };
  }
}
