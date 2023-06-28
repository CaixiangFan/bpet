import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice({
    options: {
      port: 3002,
    },
  });
  app.startAllMicroservices();
  // await app.listen(3002);
}
bootstrap();
