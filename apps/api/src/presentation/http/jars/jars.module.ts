import { Module } from '@nestjs/common';
import { JarsController } from './jars.controller';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { PrismaJarRepository } from '../../../infrastructure/prisma/repositories/prisma-jar.repository';
import { CreateJarUseCase } from '../../../application/use-cases/jars/create-jar.use-case';
import { ListJarsUseCase } from '../../../application/use-cases/jars/list-jars.use-case';
import { GetJarByIdUseCase } from '../../../application/use-cases/jars/get-jar-by-id.use-case';
import { UpdateJarUseCase } from '../../../application/use-cases/jars/update-jar.use-case';
import { DeleteJarUseCase } from '../../../application/use-cases/jars/delete-jar.use-case';
import { GetActiveJarsUseCase } from '../../../application/use-cases/jars/get-active-jars.use-case';
import { JAR_REPOSITORY } from '../../../domain/repositories/repository.tokens';

@Module({
  imports: [PrismaModule],
  controllers: [JarsController],
  providers: [
    {
      provide: JAR_REPOSITORY,
      useClass: PrismaJarRepository,
    },
    CreateJarUseCase,
    ListJarsUseCase,
    GetJarByIdUseCase,
    UpdateJarUseCase,
    DeleteJarUseCase,
    GetActiveJarsUseCase,
  ],
  exports: [JAR_REPOSITORY],
})
export class JarsModule {}
