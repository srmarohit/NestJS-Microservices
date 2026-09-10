import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller.js';
import { GatewayService } from './gateway.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ ClientsModule.register([
      {
        name: 'CatalogService',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue: 'catalog_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: 'SearchService',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue: 'search_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: 'MediaService',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue: 'media_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ])],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
