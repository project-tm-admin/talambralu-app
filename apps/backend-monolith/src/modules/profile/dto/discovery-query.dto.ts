import {
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@prisma/client';

export class DiscoveryQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  take?: number = 20;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  @Type(() => Number)
  minAge?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(100)
  @Type(() => Number)
  maxAge?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFaceVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isIncomeVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isWorkVerified?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Type(() => String)
  keywords?: string;
}
