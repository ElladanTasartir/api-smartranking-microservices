import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';
import { Environment } from 'src/common/enums/env.enum';
import { Services } from 'src/common/enums/services.enum';

@Module({
  providers: [
    {
      provide: Services.RANKINGS_SERVICE,
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>(Environment.RABBITMQ_HOST)],
            queue: configService.get<string>(Environment.RABBITMQ_QUEUE_RANKINGS),
          },
        };
        return ClientProxyFactory.create(clientConfig);
      },
      inject: [ConfigService],
    },
  ]
})
export class RankingsModule {}
