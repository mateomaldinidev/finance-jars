import { Injectable } from '@nestjs/common';
import { MonthQueryDto } from '../dto/month-query.dto';

@Injectable()
export class GetMonthlyDashboardUseCase {
  execute({ userId, month }: MonthQueryDto) {
    return {
      userId,
      month,
      summary: 'Base de dashboard mensual lista para implementar métricas.',
    };
  }
}
