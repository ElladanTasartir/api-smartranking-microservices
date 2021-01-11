import { Player } from 'src/players/interfaces/player.interface';

export interface Match {
  category: string;
  def: string;
  players: Player[];
  result: Result[];
}

export interface Result {
  set: string;
}
