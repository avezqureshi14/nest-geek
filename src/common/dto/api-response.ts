export class ApiResponse<T> {
  statusCode?: number;
  status: string;
  message?: string;
  error?: string;
  data?: T;
  meta?: any;
}
