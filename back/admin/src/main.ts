import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    options: {
      port: 3001,
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
