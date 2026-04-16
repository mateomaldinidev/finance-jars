import { BadRequestException } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';

describe('ExpensesController', () => {
  it('rejects invalid date query params', async () => {
    const controller = new ExpensesController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
    );

    await expect(
      controller.findAll(
        { id: 'user-1' },
        undefined,
        'invalid-date',
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects date ranges where from is after to', async () => {
    const controller = new ExpensesController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
    );

    await expect(
      controller.findAll(
        { id: 'user-1' },
        '2026-04-30T00:00:00.000Z',
        '2026-04-01T00:00:00.000Z',
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
