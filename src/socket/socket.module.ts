import { Module } from '@nestjs/common';
import { WebSocketsGateway } from './socket';

@Module({
  providers: [WebSocketsGateway],
  exports: [WebSocketsGateway],
})
export class SocketModule {}
