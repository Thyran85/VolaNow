/**
 * Configuration des codes USSD pour les différents opérateurs à Madagascar.
 * Permet de centraliser la logique de génération des codes pour les transferts et retraits.
 */

export type OperatorId = 'mvola' | 'orange' | 'airtel';

export interface USSDTemplate {
  withdrawal: string;
  // Les codes de transfert peuvent varier selon l'opérateur destinataire
  transfer: Record<OperatorId, string>;
}

export const USSD_CONFIG: Record<OperatorId, USSDTemplate> = {
  mvola: {
    withdrawal: '*111*1*4*1*{id}*{amount}#',
    transfer: {
      mvola: '*111*1*2*{id}*{amount}#',
      orange: '*111*1*2*{id}*{amount}#', // Exemple: Menu transfert vers autres
      airtel: '*111*1*2*{id}*{amount}#', // Exemple: Menu transfert vers autres
    },
  },
  orange: {
    withdrawal: '*144*1*{id}*{amount}#',
    transfer: {
      mvola: '*144*3*1*{id}*{amount}#',   // Exemple: Vers MVola via menu Orange
      orange: '*144*2*{id}*{amount}#',
      airtel: '*144*3*2*{id}*{amount}#',   // Exemple: Vers Airtel via menu Orange
    },
  },
  airtel: { //0326659530
    withdrawal: '*436*4*{id}*{amount})*22#',
    transfer: {
      mvola: '*436*2*3*1*{id}*{id}*{amount}#',   // Exemple: Vers MVola via menu Airtel
      orange: '*436*2*2*{id}*{amount}#',   // Exemple: Vers Orange via menu Airtel
      airtel: '*436*2*1*{id}*{amount}#',
    },
  },
};

/**
 * Génère le code USSD final en remplaçant les variables.
 * Pour un transfert, on précise l'opérateur source et l'opérateur cible.
 */
export const generateTransferCode = (
  fromOperator: OperatorId,
  toOperator: OperatorId,
  phoneNumber: string,
  amount: string
): string => {
  const template = USSD_CONFIG[fromOperator].transfer[toOperator];
  return template.replace('{id}', phoneNumber).replace('{amount}', amount);
};

/**
 * Génère le code USSD pour un retrait.
 */
export const generateWithdrawalCode = (
  operator: OperatorId,
  cashPointId: string,
  amount: string
): string => {
  const template = USSD_CONFIG[operator].withdrawal;
  return template.replace('{id}', cashPointId).replace('{amount}', amount);
};
