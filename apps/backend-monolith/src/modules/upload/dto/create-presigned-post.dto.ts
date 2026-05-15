import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum FilePurpose {
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  VERIFICATION_DOC = 'VERIFICATION_DOC',
}

export class CreatePresignedPostDto {
  @IsEnum(FilePurpose)
  @IsNotEmpty()
  purpose: FilePurpose;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
