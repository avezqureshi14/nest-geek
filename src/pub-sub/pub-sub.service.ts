import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class PubSubService {
  private kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'standard-backend',
      brokers: ['localhost:9092'],
      logLevel: logLevel.ERROR, // Adjust log level as needed
    });
  }

  async publishMessage(topic: string, message: any): Promise<void> {
    const producer = this.kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('Message published');
    await producer.disconnect();
  }

  async subscribeToTopic(topic: string, callback: (message: any) => void): Promise<void> {
    const consumer = this.kafka.consumer({ groupId: 'backend' });
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
      eachMessage: async ({ message }) => {
        callback(JSON.parse(message.value.toString()));
      },
    });
  }
}
