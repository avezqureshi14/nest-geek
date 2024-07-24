import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from 'common/dto/api-response';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine context type

    let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception instanceof HttpException ? (exception.message as string) : 'Internal Server Error';

    if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = 'User does not have the appropriate permission or role to access this resource';
    }

    const formattedResponse: ApiResponse<null> = {
      statusCode: status,
      status: 'Failure',
      message: typeof message === 'string' ? message : 'Error Occurred',
      error: exception instanceof HttpException ? message : 'Unknown Error',
    };

    if (host.getType() === 'http') {
      return response.status(status).send(formattedResponse);
    } else {
      return formattedResponse;
    }
  }
}
