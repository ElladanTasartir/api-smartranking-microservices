import { Player } from 'src/players/interfaces/player.interface';
import { Match } from './match.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge {
  date: Date;
  status: ChallengeStatus;
  requested_at: Date;
  answered_at: Date;
  challenger: string;
  category: string;
  players: Player[];
  match: Match;
}
