import { users } from '@db/@generated/users/users.model';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { permissionNames } from 'common/enums/roles_permissions.enum';
import { v4 as uuidv4 } from 'uuid';
import { AuthResponseDto } from '../../auth/dto/auth-output.dto';
import { UserClient } from '../../auth/dto/user-type.dto';

@Injectable()
export class Helpers {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  /**
   * Generate an authentication token for a user.
   * @param user - The user for whom the token is generated.
   * @returns The generated authentication token.
   */
  async generateAuthToken(user: users) {
    // Generate a unique JWT ID (jti)
    const jti = uuidv4();

    const filtered_roles_permissions = await this.getRolesPermissionForUser(user);

    // Create the payload for the JWT token
    const payload = {
      name: `${user.first_name} ${user.last_name}`,
      sub: user.id,
      jti: jti,
      email: user.email,
      phone_number: user.phone_number,
      typ: 'access',
      roles: filtered_roles_permissions.roles,
      permissions: filtered_roles_permissions.permissions,
      permissionNames: filtered_roles_permissions.permissionName,
    };

    // Get the JWT secret from the configuration
    const secret = this.config.get('JWT_SECRET');

    // Sign the payload to generate the JWT token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    // Return the generated authentication token
    return token;
  }

  /**
   * Generate a refresh token for a given user.
   *
   * @param user - The user for whom the refresh token is generated.
   * @returns The generated refresh token.
   */
  async generateRefreshToken(user: users) {
    // Generate a unique JWT ID (jti)
    const jti = uuidv4();
    const filtered_roles_permissions = await this.getRolesPermissionForUser(user);
    // Prepare the payload for the refresh token
    const payload = {
      first_name: user.first_name,
      last_name: user.last_name,
      sub: user.id,
      jti: jti,
      email: user.email,
      typ: 'refresh',
      roles: filtered_roles_permissions.roles,
    };

    // Get the refresh token secret from the configuration
    const secret = this.config.get('REFRESH_JWT_SECRET');

    // Sign the payload using the secret and generate the refresh token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });

    // Return the generated refresh token
    return token;
  }

  /**
   * Creates an authentication response object.
   *
   * @param accessToken - The access token for the authentication.
   * @param renewAccessToken - The refresh token for the authentication.
   * @param user - The user object associated with the authentication.
   * @returns The created authentication response object.
   */
  createAuthResponseObject(accessToken: string, renewAccessToken: string, user: UserClient) {
    // Create a new instance of AuthResponseDto

    const response = new AuthResponseDto();

    // Set the access token, refresh token, and user properties of the response object

    response.accessToken = accessToken;
    response.renewAccessToken = renewAccessToken;
    response.user = user;
    // Return the response object

    return response;
  }

  /**
   * Create a temporary token for the given user ID and email.
   * @param id - The user ID.
   * @param email - The user's email.
   * @returns The generated token.
   */
  async createTempToken(id: string, email: string, role: string) {
    // Generate a unique JWT ID (jti)
    const jti = uuidv4();

    // Create the payload for the token
    const payload = {
      sub: id,
      jti: jti,
      email: email,
      typ: 'temp',
      role: role,
    };

    // Get the JWT secret from the configuration
    const secret = this.config.get('REFRESH_JWT_SECRET');

    // Sign the payload with the secret and set the expiration time to 10 minutes
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret,
    });

    // Return the generated token
    return token;
  }

  /**
   * Sends a reset password email to the specified email address.
   * @param {string} email - The email address to send the reset password email to.
   * @param {Promise<string>} token - A promise that resolves to the reset password token.
   */
  sendcompletePasswordResetEmail(email: string, token: string) {
    // Generate the reset password link with the provided token

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    //TODO:SEND EMAIL FROM EMAIL SERVICE
    console.log('This is resetLink', resetLink);
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  isValidEmail = (email: string): boolean => {
    // A simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Check if a given phone number is valid.
   * @param {string} phone_number The phone number to validate.
   * @returns {boolean} True if the phone number is valid, false otherwise.
   */
  isValidPhoneNumber = (phone_number: string): boolean => {
    // If the phone number is empty or undefined, it's invalid
    if (!phone_number) {
      return false;
    }

    // Regular expression to validate phone numbers.
    // with a minimum length of 7 characters and maximum of 16 characters.
    const phoneRegex = /^\+?[0-9\-\/().\s]{6,15}[0-9]$/;

    // Test the given phone number against the regular expression
    return phoneRegex.test(phone_number);
  };

  isStrongPassword = (password: string): boolean => {
    // Check if the password meets your strength criteria
    // For example, you may require a minimum length and a mix of uppercase, lowercase, numbers, and special characters
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
  };

  /**
   * Retrieves roles and permissions for a given user.
   * @param users - The user object containing roles and permissions
   * @returns An object containing roles and permissions
   */
  async getRolesPermissionForUser(users: users) {
    // Array to store all roles
    const allRoles = [];
    // Array to store all unique permissions
    let allPermissions = [];
    // Array to store all unique permission names
    let allPermissionNames = [];

    // Iterate through each role of the user
    users.user_roles.forEach((role) => {
      // Push role name to allRoles array if not already included
      if (!allRoles.includes(role.roles.name)) {
        allRoles.push(role.roles.name);
      }

      // Collect unique permissions for each role
      // Iterate through each role of the user
      users.user_roles.forEach((role) => {
        role.roles.role_permissions.forEach((permission) => {
          if (!allPermissions.includes(permission.permission_id)) {
            allPermissions.push(permission.permission_id);
          }
        });
      });
    });

    // Collect the unique permissions for the user
    users.user_permissions.forEach((permission) => {
      if (!allPermissions.includes(permission.permission_id)) {
        allPermissions.push(permission.permission_id);
      }
    });
    // Iterate over each permission ID
    allPermissions.forEach((permissionId) => {
      // Find the corresponding permission name from the enum
      const permissionName = permissionNames[permissionId];
      // Add the permission name to allPermissionNames if it exists
      if (permissionName) {
        allPermissionNames.push(permissionName);
      }
    });

    const areAllPermissionsGranted = await this.areAllPermissionsGranted(allPermissions);
    if (areAllPermissionsGranted) {
      allPermissions = ['all'];
      allPermissionNames = ['all'];
    }
    return {
      roles: allRoles,
      permissions: allPermissions,
      permissionName: allPermissionNames,
    };
  }

  /**
   * Check if all the required permissions are granted.
   * @param permissions - The array of permissions to check against
   * @returns true if all required permissions are granted, false otherwise
   */
  async areAllPermissionsGranted(permissions: any[]) {
    const prismaService = new PrismaClient();
    const requiredPermissions = await prismaService.permissions.findMany({ select: { id: true } });
    // Iterate through requiredPermissions using for...of loop
    for (const requiredPermission of requiredPermissions) {
      // Check if the current required permission id exists in the permissions array
      if (!permissions.includes(requiredPermission.id)) {
        // If any required permission is not found, return false
        return false;
      }
    }
    // If all required permissions are found, return true
    return true;
  }
}
