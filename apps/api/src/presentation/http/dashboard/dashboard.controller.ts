import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetMonthlyDashboardUseCase } from '../../../application/use-cases/get-monthly-dashboard.use-case';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';

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
  ) {
    return this.getMonthlyDashboardUseCase.execute({
      userId: currentUser.id,
      month,
    });
  }
}
