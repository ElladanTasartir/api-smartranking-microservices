import { IsNotEmpty, IsEmail, IsPhoneNumber, IsMongoId } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsMongoId()
  readonly category: string;
}
