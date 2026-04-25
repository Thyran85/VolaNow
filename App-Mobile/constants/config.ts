/**
 * Configuration globale pour les transactions (retraits et transferts).
 */

export const TRANSACTION_CONFIG = {
  // Suggestions de montants rapides (en Ariary)
  amountSuggestions: [
    '5000',
    '10000',
    '20000',
    '50000',
    '100000',
    '200000',
  ],
  
  // Limites éventuelles
  minAmount: 100,
  maxAmount: 50000000,
};
