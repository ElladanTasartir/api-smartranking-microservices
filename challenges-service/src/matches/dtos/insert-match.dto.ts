import { Result } from '../interfaces/match.interface';

export class InsertMatchDTO {
  _id: string;
  match: {
    def: string;
    result: Result[];
  };
}
