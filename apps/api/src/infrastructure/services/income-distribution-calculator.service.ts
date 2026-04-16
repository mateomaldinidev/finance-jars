import { Injectable } from '@nestjs/common';
import type { Decimal } from '@prisma/client/runtime/library';
import type { JarEntity } from '../../../domain/entities/jar.entity';

export interface DistributionResult {
  jarId: string;
  jarName: string;
  amount: Decimal;
  percentage: number;
}

@Injectable()
export class IncomeDistributionCalculatorService {
  /**
   * Calcula la distribución de ingresos entre frascos activos.
   * Usa FLOOR para redondeo determinista.
   * La diferencia por redondeo se asigna al primer frasco.
   *
   * @param totalAmount monto total del ingreso
   * @param activeJars frascos activos ordenados
   * @returns resultado de distribución por frasco
   */
  calculateDistribution(
    totalAmount: Decimal | number,
    activeJars: JarEntity[],
  ): DistributionResult[] {
    const total = new Decimal(totalAmount);
    const decimalPlaces = 2; // USD, ARS, etc

    if (activeJars.length === 0) {
      return [];
    }

    // Paso 1: Calcular distribuciones con FLOOR
    const distributions: Array<{
      jar: JarEntity;
      calculated: Decimal;
      residue: Decimal;
    }> = activeJars.map((jar) => {
      const percentage = new Decimal(jar.percentageOfIncome);
      const calculated = total
        .times(percentage)
        .dividedBy(100)
        .toDecimalPlaces(decimalPlaces, Decimal.ROUND_DOWN); // FLOOR

      const residue = total
        .times(percentage)
        .dividedBy(100)
        .minus(calculated);

      return { jar, calculated, residue };
    });

    // Paso 2: Sumar distribuido
    const distributed = distributions.reduce(
      (sum, d) => sum.plus(d.calculated),
      new Decimal(0),
    );

    // Paso 3: Calcular diferencia (overflow)
    const difference = total.minus(distributed);

    // Paso 4: Asignar overflow al primer frasco
    if (difference.isPositive() && difference.greaterThan(0)) {
      distributions[0].calculated =
        distributions[0].calculated.plus(difference);
    }

    // Conversión a resultado final
    return distributions.map((d) => ({
      jarId: d.jar.id,
      jarName: d.jar.name,
      amount: d.calculated,
      percentage: d.jar.percentageOfIncome,
    }));
  }

  /**
   * Valida que los porcentajes de los frascos sumen 100%.
   * Si es < 100%, hay "ahorro no distribuido".
   * Si es > 100%, es error.
   */
  validatePercentages(activeJars: JarEntity[]): {
    valid: boolean;
    totalPercentage: number;
    warning?: string;
  } {
    const total = activeJars.reduce(
      (sum, jar) => sum + jar.percentageOfIncome,
      0,
    );

    if (total > 100) {
      return {
        valid: false,
        totalPercentage: total,
        warning: `Percentages exceed 100% (total: ${total}%)`,
      };
    }

    if (total < 100) {
      return {
        valid: true,
        totalPercentage: total,
        warning: `Percentages sum to ${total}% - ${100 - total}% will not be distributed`,
      };
    }

    return {
      valid: true,
      totalPercentage: total,
    };
  }
}
