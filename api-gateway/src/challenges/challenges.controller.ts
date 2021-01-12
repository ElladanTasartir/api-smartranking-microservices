import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Player } from '../players/interfaces/player.interface';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(
    @Inject('challenges-service')
    private clientChallengesService: ClientProxy,
    @Inject('admin-backend')
    private clientAdminBackend: ClientProxy,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Observable<any>> {
    const isChallenger = createChallengeDTO.players.some(
      (player) => player._id === createChallengeDTO.challenger,
    );

    if (!isChallenger) {
      throw new BadRequestException(
        `Challenger with ID "${createChallengeDTO.challenger}" is not one of the players`,
      );
    }

    const players: Player[] = await Promise.all(
      createChallengeDTO.players.map((player) =>
        this.clientAdminBackend.send('get-player', player._id).toPromise(),
      ),
    );

    const isSameCategory = players.every(
      (player) => player.category.category === createChallengeDTO.category,
    );

    if (!isSameCategory) {
      throw new BadRequestException(
        `Not all players are in category "${createChallengeDTO.category}"`,
      );
    }

    return this.clientChallengesService.send(
      'create-challenge',
      createChallengeDTO,
    );
  }
}
