import { IsMongoId } from 'class-validator';

export class FindParamDTO {
  @IsMongoId()
  _id: string;
}
