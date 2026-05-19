import { Type } from 'class-transformer';
import {
  IsDefined,
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

  @IsNumber({ allowNaN: false })
  @IsOptional()
  event_timestamp_ms?: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  expiration_at_ms?: number;

  @IsNumber({ allowNaN: false })
  @IsOptional()
  purchased_at_ms?: number;

  @IsString()
  @IsOptional()
  product_id?: string;

  @IsString()
  @IsOptional()
  store?: string;
}

export class RevenueCatWebhookDto {
  @IsString()
  @IsNotEmpty()
  api_version: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => RevenueCatEvent)
  event: RevenueCatEvent;
}
