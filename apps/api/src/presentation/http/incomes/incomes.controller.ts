import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { CreateIncomeDto } from './dto/create-income.dto';
import { IncomeResponseDto } from './dto/income-response.dto';
import { DistributionResponseDto } from './dto/distribution-response.dto';
import { CreateIncomeUseCase } from '../../../application/use-cases/incomes/create-income.use-case';
import { DistributeIncomeUseCase } from '../../../application/use-cases/incomes/distribute-income.use-case';
import { GetIncomeByIdUseCase } from '../../../application/use-cases/incomes/get-income-by-id.use-case';
import { ListIncomesUseCase } from '../../../application/use-cases/incomes/list-incomes.use-case';
import { GetDistributionAuditUseCase } from '../../../application/use-cases/incomes/get-distribution-audit.use-case';

@Controller('incomes')
@UseGuards(AuthGuard)
export class IncomesController {
  constructor(
    private readonly createIncomeUseCase: CreateIncomeUseCase,
    private readonly distributeIncomeUseCase: DistributeIncomeUseCase,
    private readonly getIncomeByIdUseCase: GetIncomeByIdUseCase,
    private readonly listIncomesUseCase: ListIncomesUseCase,
    private readonly getDistributionAuditUseCase: GetDistributionAuditUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateIncomeDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<IncomeResponseDto> {
    const income = await this.createIncomeUseCase.execute({
      userId: currentUser.id,
      amount: dto.amount,
      currency: dto.currency,
      occurredAt: new Date(dto.occurredAt),
      description: dto.description,
      tag: dto.tag,
    });

    return this.toIncomeResponse(income);
  }

  @Post(':id/distribute')
  async distribute(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<DistributionResponseDto> {
    const result = await this.distributeIncomeUseCase.execute({
      incomeMovementId: id,
      userId: currentUser.id,
    });

    return {
      id: result.distribution.id,
      incomeMovementId: result.distribution.incomeMovementId,
      totalAmount: result.distribution.totalAmount,
      currency: result.distribution.currency,
      movements: result.movements.map((m) => ({
        jarId: m.jarId,
        jarName: m.jarName,
        amount: m.amount,
        percentage: m.percentage,
      })),
      distributedAt: result.distribution.distributedAt,
    };
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: { id: string },
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<IncomeResponseDto[]> {
    const parsedFrom = this.parseOptionalDate(from, 'from');
    const parsedTo = this.parseOptionalDate(to, 'to');

    if (parsedFrom && parsedTo && parsedFrom > parsedTo) {
      throw new BadRequestException(
        'The "from" date must be less than or equal to "to" date.',
      );
    }

    const incomes = await this.listIncomesUseCase.execute({
      userId: currentUser.id,
      from: parsedFrom,
      to: parsedTo,
    });

    return incomes.map((income) => this.toIncomeResponse(income));
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<IncomeResponseDto> {
    const income = await this.getIncomeByIdUseCase.execute({
      incomeMovementId: id,
      userId: currentUser.id,
    });

    return this.toIncomeResponse(income);
  }

  @Get(':id/distribution-audit')
  async getDistributionAudit(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<any> {
    const audit = await this.getDistributionAuditUseCase.execute({
      incomeMovementId: id,
      userId: currentUser.id,
    });

    return {
      id: audit.distribution.id,
      incomeMovementId: audit.distribution.incomeMovementId,
      totalAmount: audit.distribution.totalAmount,
      currency: audit.distribution.currency,
      distributedAt: audit.distribution.distributedAt,
      movements: audit.movements,
    };
  }

  private toIncomeResponse(income: any): IncomeResponseDto {
    return {
      id: income.id,
      userId: income.userId,
      amount: income.amount,
      currency: income.currency,
      occurredAt: income.occurredAt,
      description: income.description,
      tag: income.tag,
      createdAt: income.createdAt,
    };
  }

  private parseOptionalDate(
    value: string | undefined,
    field: 'from' | 'to',
  ): Date | undefined {
    if (!value) {
      return undefined;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        `Invalid "${field}" date. Use an ISO-8601 date string.`,
      );
    }

    return parsed;
  }
}
