import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from 'src/challenges/interfaces/challenge.interface';
import { InsertMatchDTO } from './dtos/insert-match.dto';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match')
    private readonly matchesModel: Model<Match>,
  ) {}

  async insertMatch(
    challenge: Challenge,
    insertMatchDTO: InsertMatchDTO,
  ): Promise<Match> {
    const {
      match: { def, result },
    } = insertMatchDTO;
    const { category, players } = challenge;

    const match = new this.matchesModel({ def, result });

    match.category = category;
    match.players = players;

    return match.save();
  }
}
