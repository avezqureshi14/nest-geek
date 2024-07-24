import { UseGuards } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { WsAuthGuard } from './guards/ws-auth.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebSocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private eventEmitter: EventEmitter2) {}

  @WebSocketServer() server: Server;
  private connectedClients = new Map<string, { count: number; lastReset: number }>();

  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.connectedClients.set(client.id, { count: 0, lastReset: Date.now() });
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('sendMessage')
  @UseGuards(WsAuthGuard, RateLimitGuard)
  async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('Received message:', data);
    this.broadcast('sendMessage', data);
  }

  getClientData(clientId: string) {
    return this.connectedClients.get(clientId);
  }

  updateClientData(clientId: string, data: { count: number; lastReset: number }) {
    this.connectedClients.set(clientId, data);
  }

  broadcast(event: string, data: any) {
    this.eventEmitter.emit(event, data);
  }

  @OnEvent('receiveMessage')
  handleSendingMessage(payload: any) {
    this.server.emit('receiveMessage', payload);
  }
}
