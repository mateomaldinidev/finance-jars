import {
  IsNumber,
  IsString,
  IsDateString,
  IsOptional,
  Min,
  MaxLength,
  IsISO4217CurrencyCode,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIncomeDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @MaxLength(3)
  currency!: string;

  @IsDateString()
  occurredAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) => (value ? String(value).trim() : undefined))
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => (value ? String(value).trim() : undefined))
  tag?: string;
}
