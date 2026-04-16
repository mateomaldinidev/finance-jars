import { Controller, Get } from '@nestjs/common';

@Controller('movements')
export class MovementsController {
  @Get()
  findAll() {
    return {
      items: [],
      message: 'Base de movimientos lista para implementación.',
    };
  }
}
