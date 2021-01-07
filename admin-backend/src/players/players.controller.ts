import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { UpdatePlayerAvatarDTO } from './dtos/update-player-avatar.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @MessagePattern('get-players')
  async getPlayers(@Ctx() context: RmqContext): Promise<Player[]> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
    return this.playersService.getPlayers();
  }

  @MessagePattern('get-player')
  async getPlayerById(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    channel.ack(message);
    return this.playersService.getPlayerById(_id);
  }

  @MessagePattern('create-player')
  async createPlayer(
    @Payload() player: Player,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const createdPlayer = await this.playersService.createPlayer(player);

    channel.ack(message);
    return createdPlayer;
  }

  @MessagePattern('update-player')
  async updatePlayer(
    @Payload() editPlayerDTO: EditPlayerDTO,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    const updatedPlayer = await this.playersService.updatePlayer(editPlayerDTO);

    channel.ack(message);
    return updatedPlayer;
  }

  @MessagePattern('update-player-avatar')
  async updatePlayerAvatar(
    @Payload() updatePlayerAvatarDTO: UpdatePlayerAvatarDTO,
    @Ctx() context: RmqContext,
  ): Promise<Player> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      const player = await this.playersService.updatePlayerAvatar(
        updatePlayerAvatarDTO,
      );

      channel.ack(message);
      return player;
    } catch (err) {
      throw new RpcException(err.messsage);
    }
  }

  @EventPattern('delete-player')
  async deletePlayer(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const message = context.getMessage();

    await this.playersService.deletePlayer(_id);
    channel.ack(message);
  }
}
