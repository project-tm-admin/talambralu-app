import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInterestDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  receiverId: string;
}
