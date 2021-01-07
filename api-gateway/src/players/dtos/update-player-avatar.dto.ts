import { IsMongoId, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdatePlayerAvatarDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsUrl()
  avatarUrl: string;
}
