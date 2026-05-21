import { IsNotEmpty, IsUUID } from 'class-validator';

export class PassProfileDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}
