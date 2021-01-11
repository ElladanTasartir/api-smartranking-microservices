import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateChallengeDTO } from '../dtos/update-challenge.dto';
import { ChallengeStatus } from '../enums/challenge-status.enum';

export class ChallengeStatusPipe implements PipeTransform {
  readonly allowedStatuses = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.CANCELLED,
    ChallengeStatus.REJECTED,
  ];

  transform(value: UpdateChallengeDTO) {
    const { status } = value;

    if (!status && typeof status !== 'string') {
      return value;
    }

    if (!this.isValid(status)) {
      throw new BadRequestException(`"${status}" is not a valid status`);
    }

    return value;
  }

  private isValid(status: any) {
    return this.allowedStatuses.includes(status);
  }
}
