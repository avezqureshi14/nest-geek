import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthInput } from './dto';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { Helpers } from './helpers/helpers';
import { SocialAuthHelpers } from './helpers/social-auth.helpers';
import { AuthenticationGuard } from './strategies/authentication/authentication.guard';
import { JwtAuthGuard } from './strategies/authentication/jwt-token/jwt-auth.guard';
import { JwtStrategy } from './strategies/authentication/jwt-token/jwt.strategy';
import { LocalStrategy } from './strategies/authentication/local/local.strategy';
import { RefreshAuthGuard } from './strategies/authentication/refresh-token/refresh-auth.guard';
import { RefreshStrategy } from './strategies/authentication/refresh-token/refresh.strategy';
import { FacebookStrategy } from './strategies/social-auth/facebook/facebook.strategy';
import { GoogleStrategy } from './strategies/social-auth/google/google.strategy';
import { LinkedInStrategy } from './strategies/social-auth/linkedIn/linkedIn.strategy';
import { ApiResponse } from '../common/dto/api-response';
import { DBModule } from '../db/db.module';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        Helpers,
        RefreshStrategy,
        GoogleStrategy,
        SocialAuthHelpers,
        FacebookStrategy,
        LinkedInStrategy,
        JwtAuthGuard,
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
      imports: [DBModule, PassportModule, ConfigModule, JwtModule.register({})],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('should create a new user and return success message', async () => {
      const mockAuthInput: AuthInput = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'registerUser').mockImplementation(async () => {
        return Promise.resolve();
      });

      const result: ApiResponse<any> = await authController.registerUser(mockAuthInput);

      expect(result.message).toBe('User created successfully');
      expect(result.status).toBe('Success');
    });
  });

  describe('authenticateUser', () => {
    it('should log in a user and return the authentication response', async () => {
      const mockAuthInput: AuthInput = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };

      jest.spyOn(authService, 'authenticateUser').mockImplementation(async () => {
        return Promise.resolve({
          /* mock authentication response */
        });
      });

      const result: ApiResponse<any> = await authController.authenticateUser(mockAuthInput, mockRequest);

      expect(result.message).toBe('User logged in successfully');
      expect(result.status).toBe('Success');
      expect(result.data).toBeDefined();
    });
  });

  describe('renewAccessToken', () => {
    it('should refresh the token for an authenticated user', async () => {
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };

      jest.spyOn(authService, 'renewAccessToken').mockImplementation(async () => {
        return Promise.resolve({
          /* mock authentication response */
        });
      });

      const result: ApiResponse<any> = await authController.renewAccessToken(mockRequest);

      expect(result.message).toBe('Token Refreshed successfully');
      expect(result.status).toBe('Success');
      expect(result.data).toBeDefined();
    });
  });

  describe('initiatePasswordReset', () => {
    it('should initiate the password reset process and return success message', async () => {
      const mockEmailInput = { email: 'test@example.com' };

      jest.spyOn(authService, 'initiatePasswordReset').mockImplementation(async () => {
        return Promise.resolve();
      });

      const result: ApiResponse<any> = await authController.initiatePasswordReset(mockEmailInput);

      expect(result.message).toBe('Password reset process initiated. Please check your email.');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.status).toBe('Successful');
    });
  });

  describe('completePasswordReset', () => {
    it("should reset the user's password and return success message", async () => {
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };
      const newPassword = 'newPassword123';

      jest.spyOn(authService, 'completePasswordReset').mockImplementation(async () => {
        return Promise.resolve();
      });

      const result: ApiResponse<any> = await authController.completePasswordReset(mockRequest, {
        newPassword: newPassword,
      });

      expect(result.message).toBe('Password reset completed');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.status).toBe('Successful');
    });
  });

  describe('sendVerificationOtp', () => {
    it('should send OTP to the provided phone number and return success message', async () => {
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };
      const mockPhoneNo = '1234567890';

      jest.spyOn(authService, 'sendVerificationOtp').mockImplementation(async () => {
        return Promise.resolve();
      });

      const result: ApiResponse<any> = await authController.sendVerificationOtp(mockRequest, mockPhoneNo);

      expect(result.message).toBe('OTP Sent Successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.status).toBe('Successful');
    });
  });

  describe('validateOtp', () => {
    it('should verify the OTP provided by the user and return success message', async () => {
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };
      const mockvalidateOtpDto = { phone_no: '1234567890', otp: '123456' };

      jest.spyOn(authService, 'validateOtp').mockImplementation(async () => {
        return Promise.resolve(true); // Simulating a valid OTP verification
      });

      const result: ApiResponse<any> = await authController.validateOtp(mockRequest, mockvalidateOtpDto);

      expect(result.message).toBe('OTP verified Successfully');
      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.status).toBe('Successful');
    });

    it('should return error response for invalid OTP', async () => {
      const mockRequest = {
        user: {
          /* mock user data */
        },
      };
      const mockvalidateOtpDto = { phone_no: '1234567890', otp: 'invalidOTP' };

      jest.spyOn(authService, 'validateOtp').mockImplementation(async () => {
        return Promise.resolve(false); // Simulating an invalid OTP verification
      });

      const result: ApiResponse<any> = await authController.validateOtp(mockRequest, mockvalidateOtpDto);

      expect(result.message).toBe('Invalid OTP');
      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(result.status).toBe('Successful');
    });
  });
});
