import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from './interfaces/player.interface';
import { Model } from 'mongoose';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async getPlayers(): Promise<Player[]> {
    return this.playerModel.find();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id });

    if (!player) {
      throw new RpcException(`Player not found with the id "${_id}"`);
    }

    return player;
  }

  async createPlayer(player: Player): Promise<Player> {
    const { email } = player;

    const foundPlayer = await this.playerModel.findOne({ email });

    if (foundPlayer) {
      throw new RpcException(`Player with the email "${email}" already exists`);
    }

    const createdPlayer = new this.playerModel(player);

    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    return createdPlayer.save();
  }

  async updatePlayer(editPlayerDTO: EditPlayerDTO): Promise<Player> {
    const { id, player } = editPlayerDTO;

    const foundPlayer = await this.playerModel.findOneAndUpdate(
      { _id: id },
      { $set: player },
      { new: true },
    );

    if (!foundPlayer) {
      throw new RpcException(`Player with id "${id} doesn't exist"`);
    }

    return foundPlayer;
  }

  async deletePlayer(id: string): Promise<void> {
    const player = await this.getPlayerById(id);

    await player.remove();
  }
}