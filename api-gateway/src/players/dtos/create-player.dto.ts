import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreatePlayerDTO {
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly category: string;
}
