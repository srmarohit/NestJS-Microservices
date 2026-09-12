import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatalogModule } from './catalog.module.js';
import { applyToMicroservicesLayer } from '../../../libs/rpc/src/rpc.setup.js';

async function bootstrap() {
  process.title = "catalog"
  const logger = new Logger('CatalogBootstrap')
    const port = process.env.CATALOG_TCP_PORT || 4011 
    const rmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'
    const queueName = process.env.CATALOG_QUEUE || 'catalog_queue'

    console.log("RabbitMQ URL:", rmqUrl);
    console.log("Queue Name:", queueName);

      // RabbitMQ Connection
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: queueName,
        queueOptions: {
          durable: false
        }
      }
    }
  );

  // Integration of global RPC Error Handler
  applyToMicroservicesLayer(app);

    // TCP Connections
  //  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   CatalogModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: '0.0.0.0',
  //       port
  //     }
  //   },
  // );


  app.enableShutdownHooks();
  await app.listen();
  // logger.log(`Catalog is running on: ${port}`);
  logger.log(`Catalog RMQ is running on queue ${queueName} via ${rmqUrl}`);
}
await bootstrap();
