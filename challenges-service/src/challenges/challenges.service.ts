import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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

  async findChallengeById(_id: string): Promise<Challenge> {
    const challenge = await this.challengesModel.findOne({ _id });

    if (!challenge) {
      throw new RpcException(`Challenge with the ID "${_id}" doesn't exist`);
    }

    return challenge;
  }

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = new this.challengesModel(challenge);

    return createdChallenge.save();
  }
}
