import { Controller, Get } from '@nestjs/common';

@Controller('jars')
export class JarsController {
  @Get()
  findAll() {
    return {
      items: [],
      message: 'Base de frascos lista para implementación.',
    };
  }
}
