import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'ADMIN_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'REGISTRY_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
      {
        name: 'POOLMARKET_SERVICE',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
      {
        name: 'ETK_SERVICE',
        transport: Transport.TCP,
        options: { port: 3004 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
