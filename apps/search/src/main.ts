import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { MicroserviceOptions, Transport } from "@nestjs/microservices"
import { SearchModule } from "./search.module.js"

async function bootstrap(){
  process.title = "search"
  const logger = new Logger('SearchBootstrap')
  const port = process.env.SEARCH_TCP_PORT || 4012

  const rmqUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'
  const queueName = process.env.SEARCH_QUEUE || 'search_queue'

  console.log("RabbitMQ URL:", rmqUrl);
  console.log("Queue Name:", queueName);

  

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   SearchModule, {
  //     transport: Transport.TCP,
  //     options: {
  //       host: '0.0.0.0',
  //       port
  //     }
  //   }
  // )

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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
  logger.log(`Search RMQ is running on queue ${queueName} via ${rmqUrl}`);
}

await bootstrap();
