import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { FindParamDTO } from '../common/dtos/find-param.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(
    @Inject('admin-backend')
    private clientAdminBackend: ClientProxy,
  ) {}

  @Get()
  getPlayers(): Observable<any[]> {
    return this.clientAdminBackend.send('get-players', {});
  }

  @Get('/:_id')
  @UsePipes(ValidationPipe)
  getPlayerById(@Param() findParamDTO: FindParamDTO): Observable<any> {
    return this.clientAdminBackend.send('get-player', findParamDTO._id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createPlayer(@Body() createPlayerDTO: CreatePlayerDTO): Observable<any> {
    return this.clientAdminBackend.send('create-player', createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updatePlayer(
    @Param() findParamDTO: FindParamDTO,
    @Body() editPlayerDTO: EditPlayerDTO,
  ): Observable<any> {
    return this.clientAdminBackend.send('update-player', {
      id: findParamDTO._id,
      player: editPlayerDTO,
    });
  }

  @HttpCode(204)
  @UsePipes(ValidationPipe)
  @Delete('/:_id')
  deletePlayer(@Param() findParamDTO: FindParamDTO): Observable<void> {
    return this.clientAdminBackend.emit('delete-player', findParamDTO._id);
  }
}
