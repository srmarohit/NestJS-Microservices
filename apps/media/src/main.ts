import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module.js';

async function bootstrap() {
  const app = await NestFactory.create(MediaModule);
  await app.listen(process.env.port ?? 3000);
}
await bootstrap();
