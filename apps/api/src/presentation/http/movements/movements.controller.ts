import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';

@Controller('movements')
@UseGuards(AuthGuard)
export class MovementsController {
  @Get()
  findAll(@CurrentUser() currentUser: { id: string }) {
    return {
      items: [],
      userId: currentUser.id,
      message: 'Base de movimientos lista para implementación.',
    };
  }
}
