import { IsOptional, IsString } from 'class-validator';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class UpdateChallengeDTO {
  @IsOptional()
  @IsString()
  status: ChallengeStatus;
}
