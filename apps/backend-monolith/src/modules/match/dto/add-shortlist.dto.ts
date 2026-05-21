import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddShortlistDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  profileId: string;
}
