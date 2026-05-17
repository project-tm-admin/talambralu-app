import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;
}

export class MessageResponseDto {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
