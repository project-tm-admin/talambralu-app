import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RevenueCatEvent {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  app_user_id: string;

  @IsString()
  @IsNotEmpty()
  original_app_user_id: string;

  @IsNumber()
  @IsOptional()
  expiration_at_ms?: number;

  @IsNumber()
  @IsOptional()
  purchased_at_ms?: number;

  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @IsNotEmpty()
  store: string;
}

export class RevenueCatWebhookDto {
  @IsString()
  @IsNotEmpty()
  api_version: string;

  @ValidateNested()
  @Type(() => RevenueCatEvent)
  event: RevenueCatEvent;
}