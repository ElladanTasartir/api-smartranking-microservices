import { Document } from 'mongoose';
import { Match } from 'src/matches/interfaces/match.interface';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export interface Challenge extends Document {
  date: Date;
  status: ChallengeStatus;
  requested_at: Date;
  answered_at: Date;
  challenger: string;
  category: string;
  players: string[];
  match: Match;
}
