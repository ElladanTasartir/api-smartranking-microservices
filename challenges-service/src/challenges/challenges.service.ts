import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { MatchesService } from 'src/matches/matches.service';
import { InsertMatchDTO } from 'src/matches/dtos/insert-match.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject('rankings-service')
    private clientRankgingsService: ClientProxy,
    @InjectModel('Challenge')
    private challengesModel: Model<Challenge>,
    private matchesService: MatchesService,
  ) {}

  async findChallengesByPlayerId(_id: string): Promise<Challenge[]> {
    return this.challengesModel.find().where('players').in([_id]).populate('match');
  }

  async findChallengeById(_id: string): Promise<Challenge> {
    const challenge = await this.challengesModel.findOne({ _id }).populate('match');

    if (!challenge) {
      throw new RpcException(`Challenge with the ID "${_id}" doesn't exist`);
    }

    return challenge;
  }

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    const createdChallenge = new this.challengesModel(challenge);

    createdChallenge.status = ChallengeStatus.PENDING;

    return createdChallenge.save();
  }

  async insertMatch(insertMatchDTO: InsertMatchDTO): Promise<Challenge> {
    const {
      _id,
      match: { def },
    } = insertMatchDTO;

    const challenge = await this.findChallengeById(_id);

    const playerIsInTheChallenge = challenge.players.filter(
      (player) => String(player) === def,
    );

    if (!playerIsInTheChallenge.length) {
      throw new RpcException(`Player ${def} is not in the challenge`);
    }

    if (challenge.status === ChallengeStatus.FINISHED) {
      throw new RpcException(
        `Can't insert a match in already finished challenge`,
      );
    }

    if (challenge.status !== ChallengeStatus.ACCEPTED) {
      throw new RpcException(`Only accepted challenges can receive a match`);
    }

    const match = await this.matchesService.insertMatch(
      challenge,
      insertMatchDTO,
    );

    challenge.status = ChallengeStatus.FINISHED;
    challenge.match = match._id;

    await challenge.save();

    this.clientRankgingsService.emit('process-match', {
      match,
    });

    return challenge.populate('match').execPopulate();
  }

  async updateChallenge(
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Challenge> {
    const { _id, challenge } = updateChallengeDTO;

    const foundChallenge = await this.findChallengeById(_id);

    if (foundChallenge.status !== ChallengeStatus.PENDING) {
      throw new RpcException(`Cannot update challenge that is not PENDING`);
    }

    foundChallenge.status = challenge.status;
    foundChallenge.answered_at = challenge.date;

    return foundChallenge.save();
  }

  async deleteChallenge(_id: string): Promise<void> {
    const challengeToDelete = await this.findChallengeById(_id);

    await challengeToDelete.remove();
  }
}
