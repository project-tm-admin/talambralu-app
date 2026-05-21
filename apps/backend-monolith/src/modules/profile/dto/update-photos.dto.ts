import { IsArray, IsUrl, ArrayMaxSize } from 'class-validator';

export class UpdatePhotosDto {
  @IsArray()
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  photos: string[];
}
