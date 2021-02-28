import {
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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { FindParamDTO } from '../common/dtos/find-param.dto';
import { UpdatePlayerAvatarDTO } from './dtos/update-player-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalService } from 'src/uploads/local.service';
import { Services } from 'src/common/enums/services.enum';

@Controller('api/v1/players')
export class PlayersController {
  constructor(
    @Inject(Services.ADMIN_BACKEND)
    private clientAdminBackend: ClientProxy,
    private localService: LocalService,
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

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param(ValidationPipe) findParamDTO: FindParamDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.clientAdminBackend
      .send('get-player', findParamDTO._id)
      .toPromise();

    const fileName = await this.localService.uploadFile(file, findParamDTO._id);

    return this.updatePlayerAvatar({
      id: findParamDTO._id,
      avatarUrl: fileName,
    });
  }

  @UsePipes(ValidationPipe)
  updatePlayerAvatar(
    updatePlayerAvatarDTO: UpdatePlayerAvatarDTO,
  ): Observable<any> {
    return this.clientAdminBackend.send(
      'update-player-avatar',
      updatePlayerAvatarDTO,
    );
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ValidationPipe)
  @Delete('/:_id')
  deletePlayer(@Param() findParamDTO: FindParamDTO): Observable<void> {
    return this.clientAdminBackend.emit('delete-player', findParamDTO._id);
  }
}
