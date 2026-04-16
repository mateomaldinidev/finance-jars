import { Module } from '@nestjs/common';
import { JarsController } from './jars.controller';

@Module({
  controllers: [JarsController],
})
export class JarsModule {}
