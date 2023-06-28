import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    options: {
      port: 3004,
    }
  });
  app.startAllMicroservices();
}
bootstrap();
