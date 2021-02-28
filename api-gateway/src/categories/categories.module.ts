import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { Environment } from 'src/common/enums/env.enum';
import { Services } from 'src/common/enums/services.enum';
import { CategoriesController } from './categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: Services.ADMIN_BACKEND,
      useFactory: (configService: ConfigService) => {
        const clientConfig: RmqOptions = {
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>(Environment.RABBITMQ_HOST)],
            queue: configService.get<string>(Environment.RABBITMQ_QUEUE_ADMIN),
          },
        };
        return ClientProxyFactory.create(clientConfig);
      },
      inject: [ConfigService],
    },
  ],
})
export class CategoriesModule {}
