import { WebSocketsGateway } from '../socket';

export function SendViaWebSocket(event: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      console.log(event, result, args, '------');
      // Inject the WebSocket gateway to access the 'broadcast' method
      const webSocketsGateway: WebSocketsGateway = this.moduleRef.get(WebSocketsGateway, { strict: false });
      webSocketsGateway.broadcast(event, result);

      return result;
    };
  };
}
