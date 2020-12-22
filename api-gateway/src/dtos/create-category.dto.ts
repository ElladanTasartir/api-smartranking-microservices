import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Event[];
}

export interface Event {
  name: string;
  operation: string;
  value: number;
}
