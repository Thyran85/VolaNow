import { OperatorId } from '@/constants/ussd';

/**
 * Fonctions de validation pour la sécurité des transactions.
 */

/**
 * Vérifie si un numéro de téléphone est valide (exactement 10 chiffres).
 * @param phone Le numéro à vérifier
 * @returns boolean
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

/**
 * Vérifie si un ID de point de retrait (Cash Point) est valide.
 * - Pour Airtel : 7 chiffres (quelconques) ou 10 chiffres commençant par 033
 * - Pour les autres opérateurs : exactement 10 chiffres
 * @param id L'identifiant à vérifier
 * @param operator Opérateur optionnel
 * @returns boolean
 */
export const isValidCashPointId = (id: string, operator?: OperatorId): boolean => {
  const digitsOnly = id.replace(/\D/g, '');
  if (operator === 'airtel') {
    if (digitsOnly.length === 7) return true;
    if (digitsOnly.length === 10 && digitsOnly.startsWith('033')) return true;
    return false;
  }
  return digitsOnly.length === 10;
};

/**
 * Vérifie si le montant est supérieur à zéro.
 * @param amount Le montant à vérifier
 * @returns boolean
 */
export const isValidAmount = (amount: string): boolean => {
  const value = parseFloat(amount);
  return !isNaN(value) && value > 0;
};
