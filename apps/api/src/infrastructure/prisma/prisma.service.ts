import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      adapter: new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
      }),
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    void app;
    return Promise.resolve();
  }
}
