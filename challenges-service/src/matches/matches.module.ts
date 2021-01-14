import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Match',
        schema: MatchSchema,
      },
    ]),
  ],
})
export class MatchesModule {}
