import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseUseCase } from '../../../application/use-cases/expenses/create-expense.use-case';
import { GetExpenseByIdUseCase } from '../../../application/use-cases/expenses/get-expense-by-id.use-case';
import { GetJarBalanceUseCase } from '../../../application/use-cases/expenses/get-jar-balance.use-case';
import { ListExpensesUseCase } from '../../../application/use-cases/expenses/list-expenses.use-case';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { JarBalanceResponseDto } from './dto/jar-balance-response.dto';

@Controller('expenses')
@UseGuards(AuthGuard)
export class ExpensesController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getExpenseByIdUseCase: GetExpenseByIdUseCase,
    private readonly listExpensesUseCase: ListExpensesUseCase,
    private readonly getJarBalanceUseCase: GetJarBalanceUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<ExpenseResponseDto> {
    const expense = await this.createExpenseUseCase.execute({
      userId: currentUser.id,
      jarId: dto.jarId,
      amount: dto.amount,
      currency: dto.currency,
      occurredAt: new Date(dto.occurredAt),
      description: dto.description,
      tag: dto.tag,
    });

    return this.toResponse(expense);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: { id: string },
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('jarId') jarId?: string,
  ): Promise<ExpenseResponseDto[]> {
    const expenses = await this.listExpensesUseCase.execute({
      userId: currentUser.id,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      jarId,
    });

    return expenses.map((expense) => this.toResponse(expense));
  }

  @Get('jars/:jarId/balance')
  async getJarBalance(
    @Param('jarId') jarId: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarBalanceResponseDto> {
    return this.getJarBalanceUseCase.execute({
      jarId,
      userId: currentUser.id,
    });
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<ExpenseResponseDto> {
    const expense = await this.getExpenseByIdUseCase.execute({
      expenseId: id,
      userId: currentUser.id,
    });

    return this.toResponse(expense);
  }

  private toResponse(expense: any): ExpenseResponseDto {
    return {
      id: expense.id,
      userId: expense.userId,
      jarId: expense.jarId,
      amount: expense.amount,
      currency: expense.currency,
      occurredAt: expense.occurredAt,
      description: expense.description,
      tag: expense.tag,
      createdAt: expense.createdAt,
    };
  }
}