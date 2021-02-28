import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { ChallengesController } from './challenges.controller';
import { Services } from '../common/enums/services.enum';
import { Environment } from 'src/common/enums/env.enum';

@Module({
  providers: [
    {
      provide: Services.CHALLENGES_SERVICE,
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>(Environment.RABBITMQ_HOST)],
            queue: configService.get<string>(Environment.RABBITMQ_QUEUE_CHALLENGES),
          },
        };
        return ClientProxyFactory.create(clientConfig);
      },
      inject: [ConfigService],
    },
    {
      provide: Services.ADMIN_BACKEND,
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>(
              Environment.RABBITMQ_HOST
            )],
            queue: configService.get<string>(Environment.RABBITMQ_QUEUE_ADMIN),
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
