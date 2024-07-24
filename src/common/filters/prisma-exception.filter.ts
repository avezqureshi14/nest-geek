//src/prisma-client-exception.filter.ts

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'common/dto/api-response';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');
    let formattedResponse: ApiResponse<null>;
    switch (exception.code) {
      case 'P2002': {
        formattedResponse = {
          statusCode: HttpStatus.CONFLICT,
          status: 'Failure',
          message: `${exception.meta.target} already exists. Please enter a unique ${exception.meta.target}`,
          error: `${exception.meta.target} already exists. Please enter a unique ${exception.meta.target}`,
        };
        break;
      }
      case 'P2025': {
        formattedResponse = {
          statusCode: HttpStatus.NOT_FOUND,
          status: 'Failure',
          message: typeof exception.meta.cause === 'string' ? exception.meta.cause : 'Error Occurred',
          error: exception instanceof Prisma.PrismaClientKnownRequestError ? message : 'Unknown Error',
        };
        break;
      }

      default:
        formattedResponse = {
          statusCode: HttpStatus.BAD_REQUEST,
          status: 'Failure',
          message: typeof exception.meta.cause === 'string' ? exception.meta.cause : 'Error Occurred',
          error: exception instanceof Prisma.PrismaClientKnownRequestError ? message : 'Unknown Error',
        };
        break;
    }

    return formattedResponse;
  }
}
