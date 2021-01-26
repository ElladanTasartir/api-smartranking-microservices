import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { InsertMatchDTO } from 'src/matches/dtos/insert-match.dto';
import { ChallengesService } from './challenges.service';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  private logger = new Logger(ChallengesController.name);

  constructor(private challengesService: ChallengesService) {}

  @MessagePattern('get-challenges')
  async getChallengesByPlayerId(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[]> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
    return this.challengesService.findChallengesByPlayerId(_id);
  }

  @MessagePattern('get-challenge')
  async getChallengeById(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Challenge> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
    return this.challengesService.findChallengeById(_id);
  }

  @MessagePattern('create-challenge')
  async createChallenge(
    @Payload() challenge: Challenge,
    @Ctx() context: RmqContext,
  ): Promise<Challenge> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    return this.challengesService.createChallenge(challenge);
  }

  @MessagePattern('insert-match')
  async insertMatch(
    @Payload() insertMatchDTO: InsertMatchDTO,
    @Ctx() context: RmqContext,
  ): Promise<Challenge> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    return this.challengesService.insertMatch(insertMatchDTO);
  }

  @MessagePattern('update-challenge')
  async updateChallenge(
    @Payload() updateChallengeDTO: UpdateChallengeDTO,
    @Ctx() context: RmqContext,
  ): Promise<Challenge> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    return this.challengesService.updateChallenge(updateChallengeDTO);
  }

  @EventPattern('delete-challenge')
  async deleteChallenge(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);

    await this.challengesService.deleteChallenge(_id);
  }
}
