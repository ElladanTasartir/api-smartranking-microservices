import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { ChallengesController } from './challenges.controller';

@Module({
  providers: [
    {
      provide: 'challenges-service',
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST')],
            queue: configService.get<string>('RABBITMQ_QUEUE_CHALLENGES'),
          },
        };
        return ClientProxyFactory.create(clientConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: 'admin-backend',
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST')],
            queue: configService.get<string>('RABBITMQ_QUEUE_ADMIN'),
          },
        };
        return ClientProxyFactory.create(clientConfig);
      },
      inject: [ConfigService],
    },
  ],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
