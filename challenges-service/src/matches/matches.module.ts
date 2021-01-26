import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchSchema } from './interfaces/match.schema';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Match',
        schema: MatchSchema,
      },
    ]),
  ],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
