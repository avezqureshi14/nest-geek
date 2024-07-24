import { Injectable } from '@nestjs/common';
import { oauth_identities, Prisma, providers, user_otps, users } from '@prisma/client';
import { DBService } from './../db.service';
import { keyofValue, omitFields } from '../helpers/helper';

@Injectable()
export class AuthRepository {
  constructor(private prisma: DBService) {}

  /**
   * Creates a new user with the given email, hashed password, and password salt.
   * @param email - The email of the user.
   * @param hashedPassword - The hashed password of the user.
   * @returns The created user object with sensitive fields omitted.
   */
  async createUser(data: any): Promise<users> {
    // Create a new user in the database using Prisma.
    const user = await this.prisma.users.create({
      data: { ...data },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    // Omit sensitive fields from the user object.
    return omitFields(user, [keyofValue(user).password]) as unknown as users;
  }

  /**
   * Find a user by email
   * @param email - The email of the user to find
   * @returns The user object without the password fields
   */
  async findUserByEmail(email: string): Promise<any> {
    // Find the user in the database using Prisma

    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        user_permissions: true,
        user_roles: {
          include: {
            roles: {
              include: {
                role_permissions: true,
              },
            },
          },
        },
      },
    });

    return user;
  }
  /**
   * Find a user by phone_number
   * @param phone_number - The phone_number of the user to find
   * @returns The user object without the password fields and reset token
   */
  async findUserByPhone(phone_number: string): Promise<users> {
    // Find the user in the database using Prisma

    const user = await this.prisma.users.findUnique({
      where: { phone_number },
      include: {
        user_roles: {
          include: {
            roles: true,
          },
        },
      },
    });

    // Omit sensitive fields from the user object.
    return omitFields(user, [keyofValue(user).reset_token, keyofValue(user).reset_token_expiry]) as unknown as users;
  }

  /**
   * Find a user by their ID.
   *
   * @param id - The ID of the user.
   * @returns A Promise that resolves to the user object.
   */
  async findUserById(id: string): Promise<users> {
    // Use Prisma's `findUnique` method to query the database for the user with the given ID.

    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            roles: {
              include: {
                role_permissions: {
                  include: {
                    permissions: true,
                  },
                },
              },
            },
          },
        },
        user_permissions: {
          include: {
            permissions: true,
          },
        },
      },
    });
    return omitFields(user, [keyofValue(user).reset_token, keyofValue(user).reset_token_expiry]) as unknown as users;
  }

  /**
   * Updates a user by their ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<users>} dataToUpdate - The data to update the user with.
   * @returns {Promise<users | null>} - The updated user or null if the user was not found.
   */
  async updateUserById(id: string, dataToUpdate: Partial<users>): Promise<users | null> {
    // Update the user in the database using Prisma ORM.

    return await this.prisma.users.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  /**
   * Upserts an OTP record for a user.
   *
   * @param userId - The ID of the user.
   * @param otp - The OTP value.
   * @param purpose - The purpose of the OTP.
   * @returns The updated or created OTP record.
   */
  async upsertOtpRecord(userId: string, otp: string, purpose: string): Promise<user_otps> {
    const otpRecord = await this.prisma.user_otps.upsert({
      where: {
        user_id: userId,
      },
      create: {
        user_id: userId, // Create the OTP record if it doesn't exist
        otp_value: otp,
        purpose: purpose,
      },
      update: {
        otp_value: otp, // Update the OTP if the record already exists
      },
    });

    return otpRecord;
  }

  /**
   * Finds the user OTP by user ID.
   * @param user_id - The ID of the user.
   * @returns The user OTP record.
   */
  async findUserOtpByUserId(user_id: string) {
    // Use Prisma's `findUnique` method to query the database for the user OTP with the given user ID.
    return await this.prisma.user_otps.findUnique({
      where: { user_id },
    });
  }
  /**
   * Deletes user OTP by user ID.
   *
   * @param userId - The ID of the user.
   * @returns A promise that resolves when the user OTP is deleted.
   * @throws Throws an error if there is an error deleting the user OTP.
   */
  async deleteUserOtp(user_id: string): Promise<user_otps> {
    try {
      return await this.prisma.user_otps.delete({
        where: { user_id },
      });
    } catch (error) {
      console.error('Error deleting user OTP:', error);
      throw error;
    }
  }
  /**
   * Create a new OAuth identity in the database.
   * @param data - The data for the new OAuth identity.
   * @returns The newly created OAuth identity.
   */
  async createOauthIdentities(data: Prisma.oauth_identitiesCreateInput): Promise<oauth_identities> {
    // Create a new user in the database using Prisma.
    return await this.prisma.oauth_identities.create({
      data: { ...data },
    });
  }

  /**
   * Deletes the OAuth identity of a user by their user ID and provider name.
   *
   * @param userId - The ID of the user.
   * @param providerName - The name of the provider.
   * @returns The deleted OAuth identity.
   */

  async deleteOauthIdentitiesById(userId: string, providerName: providers): Promise<oauth_identities> {
    // Delete the OAuth identity using Prisma's delete method.
    return await this.prisma.oauth_identities.delete({
      where: {
        user_id_provider_name: {
          user_id: userId,
          provider_name: providerName,
        },
      },
    });
  }

  /**
   * Retrieves an OAuth identity by user ID and provider name.
   * @param userId - The ID of the user.
   * @param providerName - The name of the provider.
   * @returns The OAuth identity if found, otherwise null.
   */
  async getOauthIdentitiesByUserAndProvider(userId: string, providerName: providers): Promise<oauth_identities | null> {
    // Find the first OAuth identity that matches the user ID and provider name

    return await this.prisma.oauth_identities.findFirst({
      where: {
        user_id: userId,
        provider_name: providerName,
      },
    });
  }
}
