import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { FindParamDTO } from 'src/common/dtos/find-param.dto';
import { Player } from '../players/interfaces/player.interface';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { InsertMatchDTO } from './dtos/insert-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(
    @Inject('challenges-service')
    private clientChallengesService: ClientProxy,
    @Inject('admin-backend')
    private clientAdminBackend: ClientProxy,
  ) {}

  @Get('/:_id')
  @UsePipes(ValidationPipe)
  async getChallenges(
    @Param() findParamDTO: FindParamDTO,
  ): Promise<Observable<any>> {
    const player: Player = await this.clientAdminBackend
      .send('get-player', findParamDTO._id)
      .toPromise();

    return this.clientChallengesService.send('get-challenges', player._id);
  }

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

  @Post('/:_id/match')
  @UsePipes(ValidationPipe)
  insertMatchInChallenge(
    @Param() findParamDTO: FindParamDTO,
    @Body() insertMatchDTO: InsertMatchDTO,
  ): Observable<any> {
    return this.clientChallengesService.send('insert-match', {
      _id: findParamDTO._id,
      match: insertMatchDTO,
    });
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Param() findParamDTO: FindParamDTO,
    @Body() updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Observable<any>> {
    return this.clientChallengesService.send('update-challenge', {
      _id: findParamDTO._id,
      challenge: updateChallengeDTO,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  deleteChallenge(@Param() findParamDTO: FindParamDTO): Observable<any> {
    return this.clientChallengesService.emit(
      'delete-challenge',
      findParamDTO._id,
    );
  }
}
