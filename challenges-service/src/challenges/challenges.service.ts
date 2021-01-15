import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private challengesModel: Model<Challenge>,
  ) {}

  async findChallengesByPlayerId(_id: string): Promise<Challenge[]> {
    return this.challengesModel.find().where('players').in([_id]);
  }

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = new this.challengesModel(challenge);

    return createdChallenge.save();
  }
}
