export const INCOME_CONSTANTS = {
  // Precisión decimal para cálculos
  DECIMAL_PLACES: 2,

  // Redondeo
  ROUNDING_STRATEGY: 'FLOOR', // Determinista

  // Validaciones
  MIN_AMOUNT: 0.01,
  MAX_DESCRIPTION_LENGTH: 250,
  MAX_TAG_LENGTH: 50,

  // Monedas soportadas (ejemplos)
  SUPPORTED_CURRENCIES: ['USD', 'ARS', 'EUR', 'GBP', 'JPY'],

  // Reglas de negocio
  MINIMUM_ACTIVE_JARS: 1,
};
