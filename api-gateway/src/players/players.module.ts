import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlayersController } from './players.controller';

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
  controllers: [PlayersController],
})
export class PlayersModule {}
