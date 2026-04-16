import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { JAR_COLORS } from '../../../../infrastructure/constants/jar-colors';

export class UpdateJarDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform(({ value }) => String(value).trim())
  name?: string;

  @IsOptional()
  @IsEnum(JAR_COLORS)
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentageOfIncome?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string | null;

  @IsOptional()
  @IsString()
  currency?: string;
}
