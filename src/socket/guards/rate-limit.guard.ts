import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimit = 100; // messages per minute
  private readonly resetInterval = 60 * 1000; // 60 seconds
  private connectedClients = new Map<string, { count: number; lastReset: number }>();

  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const clientData = this.connectedClients.get(client.id) || this.resetClientData();
    this.connectedClients.set(client.id, clientData);

    if (Date.now() - clientData.lastReset > this.resetInterval) {
      clientData.count = 0;
      clientData.lastReset = Date.now();
    }

    clientData.count++;

    return clientData.count <= this.rateLimit;
  }

  private resetClientData() {
    return { count: 0, lastReset: Date.now() };
  }
}
