import { Module } from '@nestjs/common';
import { MovementsController } from './movements.controller';

@Module({
  controllers: [MovementsController],
})
export class MovementsModule {}
