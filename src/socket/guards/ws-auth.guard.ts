import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    return this.validateClient(client);
  }

  private validateClient(client: Socket): boolean {
    // Return true if authenticated, false otherwise
    const isAuthenticated = true; // Placeholder, we will replace this with actual logic later on
    return isAuthenticated;
  }
}
