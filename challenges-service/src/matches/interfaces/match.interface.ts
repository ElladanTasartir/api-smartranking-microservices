import { Document } from 'mongoose';

export interface Match extends Document {
  category: string;
  def: string;
  players: string[];
  result: Result[];
}

export interface Result {
  set: string;
}
