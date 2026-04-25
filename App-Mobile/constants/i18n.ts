import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  fr: {
    translation: {
      common: {
        confirm: "Confirmer",
        cancel: "Annuler",
        back: "Retour",
        amount: "Montant",
        phone: "Téléphone",
        operator: "Opérateur",
        history: "Historique",
        settings: "Paramètres",
        home: "Accueil",
        ar: "Ar",
        error: "Erreur",
        success: "Succès",
      },
      home: {
        title: "Services USSD",
        subtitle: "Madagascar",
        service01: "SERVICE 01",
        service02: "SERVICE 02",
        withdrawalTitle: "Retrait Cash",
        withdrawalDesc: "Effectuez vos retraits d'argent via MVola, Orange ou Airtel.",
        transferTitle: "Transfert Rapide",
        transferDesc: "Envoyez de l'argent vers n'importe quel numéro local.",
        initialize: "Initialiser",
        transfer: "Transférer",
      },
      withdrawal: {
        title: "Retrait d'argent",
        step1: "1. Choisir l'opérateur",
        step2: "2. Informations de retrait",
        cashPointLabel: "ID du Point de Retrait",
        cashPointPlaceholder: "Ex: 0340000000",
        amountLabel: "Montant (Ar)",
        amountPlaceholder: "Ex: 10000",
        confirmBtn: "Confirmer le retrait",
        helper: "L'appel USSD sera lancé automatiquement. Vous devrez saisir votre code secret pour valider.",
        errorId: "ID du point de retrait invalide (10 chiffres attendus)",
        errorAmount: "Montant invalide",
      },
      transfer: {
        title: "Transfert d'argent",
        step1: "1. Mon Opérateur (Envoi)",
        step2: "2. Opérateur Destinataire",
        step3: "3. Détails du transfert",
        recipientPhone: "Numéro du destinataire",
        confirmBtn: "Envoyer l'argent",
        helper: "Le code USSD sera généré pour un transfert de {{from}} vers {{to}}.",
        errorPhone: "Numéro de téléphone invalide (10 chiffres attendus)",
      },
      history: {
        title: "Historique",
        clear: "Effacer",
        empty: "Aucune transaction enregistrée",
        withdrawal: "Retrait d'argent",
        transfer: "Transfert d'argent",
        targetWithdrawal: "Point de retrait: ",
        targetTransfer: "Destinataire: ",
      },
      settings: {
        title: "Paramètres",
        preferences: "Préférences",
        notifications: "Notifications",
        darkMode: "Mode Sombre",
        language: "Langue",
        support: "Support & Infos",
        help: "Aide",
        about: "À propos",
        offline: "Application Hors-Ligne",
        enabled: "Activées",
        disabled: "Désactivées",
        on: "Activé",
        off: "Désactivé",
      }
    }
  },
  en: {
    translation: {
      common: {
        confirm: "Confirm",
        cancel: "Cancel",
        back: "Back",
        amount: "Amount",
        phone: "Phone",
        operator: "Operator",
        history: "History",
        settings: "Settings",
        home: "Home",
        ar: "Ar",
        error: "Error",
        success: "Success",
      },
      home: {
        title: "USSD Services",
        subtitle: "Madagascar",
        service01: "SERVICE 01",
        service02: "SERVICE 02",
        withdrawalTitle: "Cash Withdrawal",
        withdrawalDesc: "Perform cash withdrawals via MVola, Orange, or Airtel.",
        transferTitle: "Quick Transfer",
        transferDesc: "Send money to any local number.",
        initialize: "Initialize",
        transfer: "Transfer",
      },
      withdrawal: {
        title: "Money Withdrawal",
        step1: "1. Choose operator",
        step2: "2. Withdrawal information",
        cashPointLabel: "Cash Point ID",
        cashPointPlaceholder: "Ex: 0340000000",
        amountLabel: "Amount (Ar)",
        amountPlaceholder: "Ex: 10000",
        confirmBtn: "Confirm withdrawal",
        helper: "The USSD call will be launched automatically. You will need to enter your secret code to validate.",
        errorId: "Invalid Cash Point ID (10 digits expected)",
        errorAmount: "Invalid amount",
      },
      transfer: {
        title: "Money Transfer",
        step1: "1. My Operator (Sending)",
        step2: "2. Recipient Operator",
        step3: "3. Transfer Details",
        recipientPhone: "Recipient number",
        confirmBtn: "Send money",
        helper: "The USSD code will be generated for a transfer from {{from}} to {{to}}.",
        errorPhone: "Invalid phone number (10 digits expected)",
      },
      history: {
        title: "History",
        clear: "Clear",
        empty: "No transactions recorded",
        withdrawal: "Money Withdrawal",
        transfer: "Money Transfer",
        targetWithdrawal: "Cash Point: ",
        targetTransfer: "Recipient: ",
      },
      settings: {
        title: "Settings",
        preferences: "Preferences",
        notifications: "Notifications",
        darkMode: "Dark Mode",
        language: "Language",
        support: "Support & Info",
        help: "Help",
        about: "About",
        offline: "Offline Application",
        enabled: "Enabled",
        disabled: "Disabled",
        on: "On",
        off: "Off",
      }
    }
  }
};

const LANG_STORAGE_KEY = '@app_language';

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANG_STORAGE_KEY);
  
  if (!savedLanguage) {
    const systemLocale = Localization.getLocales()[0].languageCode;
    savedLanguage = systemLocale === 'fr' ? 'fr' : 'en';
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;
