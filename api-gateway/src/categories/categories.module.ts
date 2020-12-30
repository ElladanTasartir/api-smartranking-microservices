import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CategoriesController } from './categories.controller';

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
  controllers: [CategoriesController],
})
export class CategoriesModule {}
