import { IsMongoId, IsOptional, IsPhoneNumber } from 'class-validator';

export class EditPlayerDTO {
  @IsOptional()
  @IsPhoneNumber('BR')
  readonly phoneNumber: string;

  @IsOptional()
  readonly name: string;

  @IsOptional()
  @IsMongoId()
  readonly category: string;
}
