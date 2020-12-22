import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
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
