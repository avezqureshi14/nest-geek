import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { oauth_identities, providers, user_otps, users } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthRepository } from './auth-db.repository';

@Injectable()
export class AuthDbService {
  constructor(private authRepository: AuthRepository) {}

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns A Promise that resolves to the user object.
   */
  async findUserByEmail(email: string): Promise<users> {
    return await this.authRepository.findUserByEmail(email);
  }
  /**
   * Finds a user by phone_number.
   * @param phone_no - The phone_number of the user to find.
   * @returns A Promise that resolves to the user object.
   */
  async findUserByPhone(phone_number: string): Promise<users> {
    return await this.authRepository.findUserByPhone(phone_number);
  }
  /**
   * Find a user by their ID.
   *
   * @param id - The ID of the user.
   * @returns A Promise that resolves to the user.
   */
  async findUserById(id: string): Promise<users> {
    return await this.authRepository.findUserById(id);
  }

  /**
   * Create a new user with the specified email and hashed password.
   * @param {string} email - The email of the user.
   * @param {string} hashedPassword - The hashed password of the user.
   * @returns {Promise<users>} - The created user.
   * @throws {ForbiddenException} - If the credentials are already taken.
   * @throws {Error} - If an unexpected error occurs.
   */
  async createUser(data: any): Promise<users> {
    try {
      return await this.authRepository.createUser(data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('Credentials already taken');
      }
      throw error;
    }
  }

  /**
   * Update a user by their ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Partial<users>} dataToUpdate - The data to update for the user.
   * @returns {Promise<users | null>} - The updated user or null if not found.
   * @throws {ConflictException} - If there is a conflict when updating the user.
   */
  async updateUserById(id: string, dataToUpdate: Partial<users>): Promise<users | null> {
    try {
      // Update the user using the auth repository

      return await this.authRepository.updateUserById(id, dataToUpdate);
    } catch (error) {
      // Handle conflicts when updating the user

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2022' // You may need to check the exact Prisma error code for update conflicts
      ) {
        throw new ConflictException('The column you want to update does not exists');
      }
      throw error;
    }
  }

  /**
   * Upserts a user OTP record.
   * @param userId - The ID of the user.
   * @param otp - The OTP value.
   * @param purpose - The purpose of the OTP.
   * @returns The updated user OTP record.
   * @throws Throws an error if there is an error upserting the OTP record.
   */
  async upsertUserOtp(userId: string, otp: string, purpose: string): Promise<user_otps> {
    try {
      return await this.authRepository.upsertOtpRecord(userId, otp, purpose);
    } catch (error: any) {
      console.log('Error: ', error);
      throw error;
    }
  }

  /**
   * Find user OTP by user ID.
   *
   * @param user_id - The ID of the user.
   * @returns A promise that resolves to the user OTPs.
   */
  async findUserOtpByUserId(user_id: string): Promise<user_otps> {
    return await this.authRepository.findUserOtpByUserId(user_id);
  }
  /**
   * Deletes user OTP by user ID.
   *
   * @param userId - The ID of the user.
   * @returns A promise that resolves when the user OTP is deleted.
   * @throws Throws an error if there is an error deleting the user OTP.
   */
  async deleteUserOtp(userId: string): Promise<user_otps> {
    try {
      return await this.authRepository.deleteUserOtp(userId);
    } catch (error) {
      console.error('Error deleting user OTP:', error);
      throw error;
    }
  }

  /**
   * Creates OAuth identities.
   * @param data - The data for creating the OAuth identities.
   * @returns A Promise that resolves to the created OAuth identities.
   * @throws {ForbiddenException} If the user already has this provider assigned.
   */
  async createOauthIdentities(data: any): Promise<oauth_identities> {
    try {
      return await this.authRepository.createOauthIdentities(data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ForbiddenException('User already has this provider assigned');
      }
      throw error;
    }
  }

  /**
   * Retrieve OAuth identities for a user by their ID and provider name.
   * @param userId - The ID of the user.
   * @param providerName - The name of the provider.
   * @returns A Promise that resolves to the array of OAuth identities.
   */
  async getOauthIdentitiesByUserAndProvider(userId: string, providerName: providers): Promise<oauth_identities> {
    // Call the auth repository to retrieve OAuth identities.

    return await this.authRepository.getOauthIdentitiesByUserAndProvider(userId, providerName);
  }

  /**
   * Delete OAuth identities by user and provider.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} providerName - The name of the provider.
   * @returns {Promise<void>} - A Promise that resolves when the OAuth identities are deleted.
   */
  async deleteOauthIdentitiesByUserAndProvider(userId: string, providerName: providers) {
    // Call the auth repository method to delete the OAuth identities.

    try {
      return await this.authRepository.deleteOauthIdentitiesById(userId, providerName);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ForbiddenException('Record does not exists');
      }
      throw error;
    }
  }
}
