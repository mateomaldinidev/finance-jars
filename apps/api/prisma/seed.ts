import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: databaseUrl,
  }),
});

async function hashPassword(plainText: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(plainText, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function main() {
  const username = process.env.DEMO_USERNAME ?? 'demo';
  const plainPassword = process.env.DEMO_PASSWORD ?? 'demo12345';

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  const user =
    existingUser ??
    (await prisma.user.create({
      data: {
        username,
        passwordHash: await hashPassword(plainPassword),
        baseCurrency: 'ARS',
      },
    }));

  const defaultJars = [
    {
      name: 'Necesidades',
      color: 'blue',
      currency: 'ARS',
      percentageOfIncome: 55,
      description: 'Gastos fijos y esenciales.',
      active: true,
    },
    {
      name: 'Ahorro',
      color: 'green',
      currency: 'ARS',
      percentageOfIncome: 30,
      description: 'Reserva y fondo de seguridad.',
      active: true,
    },
    {
      name: 'Deseos',
      color: 'amber',
      currency: 'ARS',
      percentageOfIncome: 15,
      description: 'Consumo personal discrecional.',
      active: true,
    },
  ];

  for (const jar of defaultJars) {
    await prisma.jar.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: jar.name,
        },
      },
      update: {
        color: jar.color,
        currency: jar.currency,
        percentageOfIncome: jar.percentageOfIncome,
        description: jar.description,
        active: jar.active,
        deletedAt: null,
      },
      create: {
        userId: user.id,
        name: jar.name,
        color: jar.color,
        currency: jar.currency,
        percentageOfIncome: jar.percentageOfIncome,
        description: jar.description,
        active: jar.active,
      },
    });
  }

  const existingSeedIncome = await prisma.movement.findFirst({
    where: {
      userId: user.id,
      externalRef: 'seed-income-1',
      type: 'INCOME',
      jarId: null,
    },
  });

  if (!existingSeedIncome) {
    const jars = await prisma.jar.findMany({
      where: {
        userId: user.id,
        active: true,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (jars.length > 0) {
      const incomeDate = new Date();
      incomeDate.setDate(incomeDate.getDate() - 2);

      const rootIncome = await prisma.movement.create({
        data: {
          userId: user.id,
          type: 'INCOME',
          amount: 150000,
          currency: 'ARS',
          occurredAt: incomeDate,
          note: 'Ingreso demo',
          externalRef: 'seed-income-1',
        },
      });

      const distributionMovements = [
        { jarName: 'Necesidades', amount: 82500 },
        { jarName: 'Ahorro', amount: 45000 },
        { jarName: 'Deseos', amount: 22500 },
      ];

      await prisma.incomeDistribution.create({
        data: {
          userId: user.id,
          incomeMovementId: rootIncome.id,
          totalAmount: 150000,
          currency: 'ARS',
          distributedAmount: 150000,
          distributedAt: new Date(),
        },
      });

      for (const item of distributionMovements) {
        const jar = jars.find((candidate) => candidate.name === item.jarName);
        if (!jar) {
          continue;
        }

        await prisma.movement.create({
          data: {
            userId: user.id,
            jarId: jar.id,
            type: 'INCOME',
            amount: item.amount,
            currency: 'ARS',
            occurredAt: incomeDate,
            note: 'Distribucion demo inicial',
            externalRef: `distributed_${rootIncome.id}`,
          },
        });
      }

      const needsJar = jars.find((jar) => jar.name === 'Necesidades');
      if (needsJar) {
        await prisma.movement.create({
          data: {
            userId: user.id,
            jarId: needsJar.id,
            type: 'EXPENSE',
            amount: 12000,
            currency: 'ARS',
            occurredAt: new Date(),
            note: 'Gasto demo supermercado',
            externalRef: 'seed-expense-1',
          },
        });
      }
    }
  }

  console.log('Seed completed.');
  console.log(`Demo user: ${username}`);
  console.log(`Demo password: ${plainPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
