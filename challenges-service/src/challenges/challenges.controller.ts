import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
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

    try {
      const createdChallenge = this.challengesService.createChallenge(
        challenge,
      );

      channel.ack(message);

      return createdChallenge;
    } catch (err) {
      throw new RpcException(
        `There was an error creating the challenge: ${err.message}`,
      );
    }
  }
}
