import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';

@Controller('jars')
@UseGuards(AuthGuard)
export class JarsController {
  @Get()
  findAll(@CurrentUser() currentUser: { id: string }) {
    return {
      items: [],
      userId: currentUser.id,
      message: 'Base de frascos lista para implementación.',
    };
  }
}
