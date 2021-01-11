import { IsNotEmpty } from 'class-validator';
import { Result } from '../interfaces/match.interface';

export class InsertMatchDTO {
  @IsNotEmpty()
  def: string;

  @IsNotEmpty()
  result: Result[];
}
