import { IsMongoId, IsString } from 'class-validator';

export class InsertPlayerInCategoryDTO {
  @IsString()
  category: string;

  @IsMongoId()
  player: string;
}
