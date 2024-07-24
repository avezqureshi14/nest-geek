// response.util.ts
export class ResponseUtil {
  static success(data: any, message: string = 'Success') {
    return { status: 'Success', data, message };
  }

  static error(message: string = 'Error', statusCode: number = 500) {
    return { status: 'Failure', message, statusCode };
  }
}
