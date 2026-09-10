import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MediaModule } from './media.module.js';

async function bootstrap() {
  process.title = "media"
  const logger = new Logger('MediaBootstrap')
    const port = process.env.MEDIA_TCP_PORT || 4013 

    const rmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'
    const queueName = process.env.MEDIA_QUEUE || 'media_queue'

    console.log("RabbitMQ URL:", rmqUrl);
    console.log("Queue Name:", queueName);

  //  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   MediaModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       host: '0.0.0.0',
  //       port
  //     }
  //   },
  // );

  // RabbitMQ Connection
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
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

  app.enableShutdownHooks();
  await app.listen();
  // logger.log(`Media is running on: ${port}`);
  logger.log(`Media RMQ is running on queue ${queueName} via ${rmqUrl}`);

}
await bootstrap();












// docker run -d   --name rabbitmq   -p 5672:5672   -p 15672:15672   -e RABBITMQ_DEFAULT_USER=admin   -e RABBITMQ_DEFAULT_PASS=admin   rabbitmq:3-management
