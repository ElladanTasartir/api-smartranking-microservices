import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class UpdateChallengeDTO {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  status: ChallengeStatus;
}
