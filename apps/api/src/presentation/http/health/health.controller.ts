import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  getHealth() {
    return {
      name: 'finance-jars-api',
      status: 'ok',
      message: 'API base local-first inicializada.',
    };
  }
}
