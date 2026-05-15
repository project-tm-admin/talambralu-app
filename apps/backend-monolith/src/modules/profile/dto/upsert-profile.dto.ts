import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '@prisma/client';

export class UpsertProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;
}
