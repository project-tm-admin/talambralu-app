import { IsNotEmpty, IsString } from 'class-validator';

export class AddShortlistDto {
  @IsNotEmpty()
  @IsString()
  profileId: string;
}
