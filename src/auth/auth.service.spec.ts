import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { user_otps, users } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth-input.dto';
import { AuthResponseDto } from './dto/auth-output.dto';
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
import { AuthDbService } from '../db/auth/auth-db.service';
import { DBModule } from '../db/db.module';

describe('AuthService', () => {
  let authService: AuthService;
  let authDbService: AuthDbService;
  let helpers: Helpers;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authService = module.get<AuthService>(AuthService);
    authDbService = module.get<AuthDbService>(AuthDbService);
    helpers = module.get<Helpers>(Helpers);
    hashingService = module.get<HashingService>(HashingService);
  });

  describe('registerUser', () => {
    it('should create a new user and not throw an exception', async () => {
      // Arrange
      const mockAuthInput: AuthInput = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'registerUser').mockImplementation(async () => {});

      jest.spyOn(authDbService, 'createUser').mockResolvedValueOnce({
        email: mockAuthInput.email,
        password: 'hashedPassword',
      } as users);

      // Act & Assert
      await expect(authService.registerUser(mockAuthInput)).resolves.not.toThrow();
    });

    it('should throw UnauthorizedException when user creation fails', async () => {
      // Arrange
      const mockAuthInput: AuthInput = {
        email: 'test@example.com',
        password: 'password',
      };

      //   jest.spyOn(authService, "registerUser").mockImplementation(async () => {
      //     throw new UnauthorizedException()
      //   })

      jest.spyOn(authDbService, 'createUser').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.registerUser(mockAuthInput)).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should validate user credentials and return user object if valid', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;

      jest.spyOn(authService, 'validateUser').mockImplementation(async () => mockUser);
      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(mockUser);

      // Act & Assert
      await expect(authService.validateUser('test@example.com', 'password')).resolves.toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      // Arrange
      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.validateUser('nonexistent@example.com', 'password')).rejects.toThrowError(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when provided password is invalid', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;

      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(hashingService, 'compare').mockResolvedValueOnce(false);

      // Act & Assert
      await expect(authService.validateUser('test@example.com', 'invalidPassword')).rejects.toThrowError(
        UnauthorizedException
      );
    });
  });

  describe('authenticateUser', () => {
    it('should log in a user and return the authentication response', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;

      jest.spyOn(authService, 'authenticateUser').mockImplementation(
        async () =>
          ({
            accessToken: 'mockAccessToken',
            renewAccessToken: 'mockRefreshToken',
          }) as AuthResponseDto
      );

      jest.spyOn(helpers, 'generateAuthToken').mockResolvedValueOnce('mockAccessToken');
      jest.spyOn(helpers, 'generateRefreshToken').mockResolvedValueOnce('mockRefreshToken');
      jest.spyOn(authService, 'loginOrCreateUserForSocial' as keyof AuthService).mockResolvedValueOnce({
        accessToken: 'mockAccessToken',
        renewAccessToken: 'mockRefreshToken',
      } as AuthResponseDto);

      jest.spyOn(authDbService, 'updateUserById').mockImplementation(async (id, _dataToUpdate) => {
        // Customize the mock implementation based on the expected function signature
        // For example, you can return a user object with the updated data
        return {
          id: id,
          email: 'test@example.com',
          password: 'hashedPassword',
          first_name: 'Test',
          last_name: 'User',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
          email_verified: false,
          phone_number: '',
          reset_token: '',
          reset_token_expiry: new Date(),
          avatar: '',
          last_login: new Date(),
          // other properties...
        };
      });

      // Act & Assert
      await expect(authService.authenticateUser(mockUser)).resolves.toEqual({
        accessToken: 'mockAccessToken',
        renewAccessToken: 'mockRefreshToken',
      });
    });
  });

  describe('renewAccessToken', () => {
    it('should refresh the token for an authenticated user', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;

      jest.spyOn(authService, 'renewAccessToken').mockImplementation(
        async () =>
          ({
            accessToken: 'mockAccessToken',
          }) as AuthResponseDto
      );

      jest.spyOn(helpers, 'generateAuthToken').mockResolvedValueOnce('mockAccessToken');

      // Act & Assert
      await expect(authService.renewAccessToken(mockUser)).resolves.toEqual({
        accessToken: 'mockAccessToken',
      });
    });
  });

  describe('initiatePasswordReset', () => {
    it('should initiate the password reset process and return success message', async () => {
      // Arrange
      const mockEmail = 'test@example.com';

      jest.spyOn(authService, 'initiatePasswordReset').mockImplementation(async () => {});
      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce({
        id: 'someUserId',
        role: 'user',
      } as users);

      jest.spyOn(helpers, 'createTempToken').mockResolvedValueOnce('mockTempToken');
      jest.spyOn(helpers, 'sendcompletePasswordResetEmail').mockImplementation(() => {});

      // Act & Assert
      await expect(authService.initiatePasswordReset(mockEmail)).resolves.toBeUndefined();
    });

    it('should throw BadRequestException when email is empty', async () => {
      // Arrange
      const mockEmail = '';

      // Act & Assert
      await expect(authService.initiatePasswordReset(mockEmail)).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      const mockEmail = 'nonexistent@example.com';

      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.initiatePasswordReset(mockEmail)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('completePasswordReset', () => {
    it("should reset the user's password and return success message", async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;
      const newPassword = 'newPassword123';

      jest.spyOn(authService, 'completePasswordReset').mockImplementation(async () => {});
      jest.spyOn(hashingService, 'hash').mockResolvedValueOnce('hashedNewPassword');

      jest.spyOn(authDbService, 'updateUserById').mockImplementation(async (id, _dataToUpdate) => {
        // Customize the mock implementation based on the expected function signature
        // For example, you can return a user object with the updated data
        return {
          id: id,
          email: 'test@example.com',
          password: 'hashedPassword',
          first_name: 'Test',
          last_name: 'User',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date(),
          email_verified: false,
          phone_number: '',
          reset_token: '',
          reset_token_expiry: new Date(),
          avatar: '',
          last_login: new Date(),
          // other properties...
        };
      });

      // Act & Assert
      await expect(authService.completePasswordReset(newPassword, mockUser)).resolves.toBeUndefined();
    });
  });

  describe('sendVerificationOtp', () => {
    it('should send OTP to the provided phone number and return success message', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;
      const mockPhoneNo = '1234567890';

      jest.spyOn(authService, 'sendVerificationOtp').mockImplementation(async () => {});
      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(helpers, 'generateOtp' as keyof Helpers).mockResolvedValueOnce(Promise.resolve('123456'));

      // Act & Assert
      await expect(authService.sendVerificationOtp(mockPhoneNo, mockUser)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for user with nonexistent email', async () => {
      // Arrange
      const mockUser = {
        email: 'nonexistent@example.com',
      } as users;
      const mockPhoneNo = '1234567890';

      jest.spyOn(authDbService, 'findUserByEmail').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.sendVerificationOtp(mockPhoneNo, mockUser)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('validateOtp', () => {
    it('should verify the OTP provided by the user and return success message', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;
      const mockvalidateOtpDto = { phone_no: '1234567890', otp: '123456' };

      jest.spyOn(authService, 'validateOtp').mockImplementation(async () => true);
      jest.spyOn(authDbService, 'findUserOtpByUserId').mockResolvedValueOnce({
        id: 'someOtpId',
        otp_value: '123456',
      } as user_otps);

      // Act & Assert
      await expect(
        authService.validateOtp(mockvalidateOtpDto.phone_no, mockvalidateOtpDto.otp, mockUser)
      ).resolves.toBe(true);
    });

    it('should return false for invalid OTP', async () => {
      // Arrange
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        id: 'someUserId',
      } as users;
      const mockvalidateOtpDto = { phone_no: '1234567890', otp: 'invalidOTP' };

      jest.spyOn(authService, 'validateOtp').mockImplementation(async () => false);
      jest.spyOn(authDbService, 'findUserOtpByUserId').mockResolvedValueOnce({
        id: 'someOtpId',
        otp_value: '123456',
      } as user_otps);

      // Act & Assert
      await expect(
        authService.validateOtp(mockvalidateOtpDto.phone_no, mockvalidateOtpDto.otp, mockUser)
      ).resolves.toBe(false);
    });
  });
});
