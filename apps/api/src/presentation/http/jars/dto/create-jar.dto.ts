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

export class CreateJarDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Transform(({ value }) => String(value).trim())
  name!: string;

  @IsEnum(JAR_COLORS)
  color!: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  percentageOfIncome!: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
