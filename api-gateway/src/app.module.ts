import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'admin-backend',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672/smartranking'],
          queue: 'admin-backend',
        },
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
