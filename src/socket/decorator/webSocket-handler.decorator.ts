import { WebSocketsGateway } from '../socket';

export function WebSocketHandler(event: string): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    console.log(descriptor.value, '-------web');
    descriptor.value = function (...args: any[]) {
      const webSocketsGateway: WebSocketsGateway = this.moduleRef.get(WebSocketsGateway, { strict: false });
      webSocketsGateway.server.on(event, (...args: any[]) => {
        originalMethod.apply(this, args);
      });
    };
  };
}
