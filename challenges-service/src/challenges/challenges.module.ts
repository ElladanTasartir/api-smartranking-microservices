import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MatchesModule } from 'src/matches/matches.module';
import { ClientProxyFactory, RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Challenge',
        schema: ChallengeSchema,
      },
    ]),
    MatchesModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, {
    provide: 'rankings-service',
    useFactory: (configService: ConfigService) => {
      const clientConfig: RmqOptions = {
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_HOST')],
          queue: configService.get<string>('RABBITMQ_QUEUE_RANKINGS'),
        },
      };
      return ClientProxyFactory.create(clientConfig);
    },
    inject: [ConfigService],
  },],
})
export class ChallengesModule {}
