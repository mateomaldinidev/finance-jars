import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9._-]+$/)
  @Transform(({ value }) => String(value).trim())
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
