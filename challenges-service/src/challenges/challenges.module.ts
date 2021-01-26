import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { MatchesModule } from 'src/matches/matches.module';

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
  providers: [ChallengesService],
})
export class ChallengesModule {}
