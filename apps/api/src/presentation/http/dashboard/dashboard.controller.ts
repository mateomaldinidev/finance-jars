import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from '../../../application/use-cases/get-monthly-dashboard.use-case';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { MonthlyDashboardResponseDto } from './dto/monthly-dashboard-response.dto';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(
    private readonly getMonthlyDashboardUseCase: GetMonthlyDashboardUseCase,
  ) {}

  @Get('monthly')
  getMonthly(
    @CurrentUser() currentUser: { id: string },
    @Query('month') month = new Date().toISOString().slice(0, 7),
  ): Promise<MonthlyDashboardResponseDto> {
    return this.getMonthlyDashboardUseCase.execute({
      userId: currentUser.id,
      month,
    });
  }
}
