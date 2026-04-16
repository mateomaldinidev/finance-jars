import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { CreateJarDto } from './dto/create-jar.dto';
import { UpdateJarDto } from './dto/update-jar.dto';
import { JarResponseDto } from './dto/jar-response.dto';
import { CreateJarUseCase } from '../../../application/use-cases/jars/create-jar.use-case';
import { ListJarsUseCase } from '../../../application/use-cases/jars/list-jars.use-case';
import { GetJarByIdUseCase } from '../../../application/use-cases/jars/get-jar-by-id.use-case';
import { UpdateJarUseCase } from '../../../application/use-cases/jars/update-jar.use-case';
import { DeleteJarUseCase } from '../../../application/use-cases/jars/delete-jar.use-case';
import { GetActiveJarsUseCase } from '../../../application/use-cases/jars/get-active-jars.use-case';

@Controller('jars')
@UseGuards(AuthGuard)
export class JarsController {
  constructor(
    private readonly createJarUseCase: CreateJarUseCase,
    private readonly listJarsUseCase: ListJarsUseCase,
    private readonly getJarByIdUseCase: GetJarByIdUseCase,
    private readonly updateJarUseCase: UpdateJarUseCase,
    private readonly deleteJarUseCase: DeleteJarUseCase,
    private readonly getActiveJarsUseCase: GetActiveJarsUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateJarDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarResponseDto> {
    const jar = await this.createJarUseCase.execute({
      userId: currentUser.id,
      name: dto.name,
      color: dto.color,
      percentageOfIncome: dto.percentageOfIncome,
      description: dto.description,
      currency: dto.currency,
      active: dto.active,
    });
    return this.toResponse(jar);
  }

  @Get()
  async findAll(
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarResponseDto[]> {
    const jars = await this.listJarsUseCase.execute({
      userId: currentUser.id,
    });
    return jars.map((jar) => this.toResponse(jar));
  }

  @Get('active')
  async findActive(
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarResponseDto[]> {
    const jars = await this.getActiveJarsUseCase.execute({
      userId: currentUser.id,
    });
    return jars.map((jar) => this.toResponse(jar));
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarResponseDto> {
    const jar = await this.getJarByIdUseCase.execute({
      jarId: id,
      userId: currentUser.id,
    });
    return this.toResponse(jar);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJarDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<JarResponseDto> {
    const jar = await this.updateJarUseCase.execute({
      jarId: id,
      userId: currentUser.id,
      name: dto.name,
      color: dto.color,
      description: dto.description,
      percentageOfIncome: dto.percentageOfIncome,
      currency: dto.currency,
      active: dto.active,
    });
    return this.toResponse(jar);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<void> {
    await this.deleteJarUseCase.execute({
      jarId: id,
      userId: currentUser.id,
    });
  }

  private toResponse(jar: any): JarResponseDto {
    return {
      id: jar.id,
      userId: jar.userId,
      name: jar.name,
      color: jar.color,
      description: jar.description,
      percentageOfIncome: jar.percentageOfIncome,
      currency: jar.currency,
      active: jar.active,
      createdAt: jar.createdAt,
      updatedAt: jar.updatedAt,
    };
  }
}
