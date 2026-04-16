import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateExpenseUseCase } from './create-expense.use-case';

describe('CreateExpenseUseCase', () => {
  it('creates expense when jar exists and balance is sufficient', async () => {
    const expenseRepository = {
      create: jest.fn().mockResolvedValue({ id: 'exp-1' }),
    };
    const jarRepository = {
      findById: jest.fn().mockResolvedValue({
        id: 'jar-1',
        userId: 'user-1',
        currency: 'ARS',
      }),
    };
    const jarBalanceRepository = {
      getBalance: jest.fn().mockResolvedValue(1000),
    };

    const useCase = new CreateExpenseUseCase(
      expenseRepository as any,
      jarRepository as any,
      jarBalanceRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      jarId: 'jar-1',
      amount: 250,
      currency: 'ARS',
      occurredAt: new Date('2026-04-16T10:00:00.000Z'),
      description: 'Supermercado',
      tag: 'hogar',
    });

    expect(expenseRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'exp-1' });
  });

  it('fails when jar does not exist', async () => {
    const useCase = new CreateExpenseUseCase(
      { create: jest.fn() } as any,
      { findById: jest.fn().mockResolvedValue(null) } as any,
      { getBalance: jest.fn() } as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        jarId: 'jar-404',
        amount: 100,
        currency: 'ARS',
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('fails when balance is insufficient', async () => {
    const useCase = new CreateExpenseUseCase(
      { create: jest.fn() } as any,
      {
        findById: jest.fn().mockResolvedValue({
          id: 'jar-1',
          userId: 'user-1',
          currency: 'ARS',
        }),
      } as any,
      { getBalance: jest.fn().mockResolvedValue(50) } as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        jarId: 'jar-1',
        amount: 100,
        currency: 'ARS',
        occurredAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
