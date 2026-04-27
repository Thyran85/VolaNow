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
        service03: "SERVICE 03",
        withdrawalTitle: "Retrait Cash",
        withdrawalDesc: "Effectuez vos retraits d'argent via MVola, Orange ou Airtel.",
        transferTitle: "Transfert Rapide",
        transferDesc: "Envoyez de l'argent vers n'importe quel numéro local.",
        rechargeTitle: "Recharge Flash",
        rechargeDesc: "Scannez votre carte de recharge pour créditer votre compte instantanément.",
        initialize: "Initialiser",
        transfer: "Transférer",
      },
      recharge: {
        title: "Scanner de recharge",
        analyzing: "Recherche du code...",
        codeReady: "Code prêt",
        placeCard: "Placez la carte",
        rechargeBtn: "RECHARGER",
        detectBtn: "DÉTECTER",
        scan: "SCANNER",
        retry: "Réessayer",
        permissionError: "Permission caméra requise",
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
        vibration: "Vibrations",
        darkMode: "Mode Sombre",
        language: "Langue",
        support: "Support & Infos",
        help: "Aide & Guideline",
        about: "À propos",
        offline: "Application Hors-Ligne",
        enabled: "Activées",
        disabled: "Désactivées",
        on: "Activé",
        off: "Désactivé",
        helpContent: "1. Choisissez votre service (Retrait ou Transfert).\n2. Sélectionnez l'opérateur concerné.\n3. Remplissez les informations demandées.\n4. Cliquez sur confirmer pour lancer l'appel USSD.\n5. Validez avec votre code secret sur votre téléphone.",
        whatsappContact: "Contact WhatsApp : +261 34 83 617 22"
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
        service03: "SERVICE 03",
        withdrawalTitle: "Cash Withdrawal",
        withdrawalDesc: "Perform cash withdrawals via MVola, Orange, or Airtel.",
        transferTitle: "Quick Transfer",
        transferDesc: "Send money to any local number.",
        rechargeTitle: "Flash Recharge",
        rechargeDesc: "Scan your recharge card to credit your account instantly.",
        initialize: "Initialize",
        transfer: "Transfer",
      },
      recharge: {
        title: "Recharge Scanner",
        analyzing: "Searching for code...",
        codeReady: "Code ready",
        placeCard: "Place the card",
        rechargeBtn: "RECHARGE",
        detectBtn: "DETECT",
        scan: "SCANNER",
        permissionError: "Camera permission required",
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
        vibration: "Vibrations",
        darkMode: "Dark Mode",
        language: "Language",
        support: "Support & Info",
        help: "Help & Guideline",
        about: "About",
        offline: "Offline Application",
        enabled: "Enabled",
        disabled: "Disabled",
        on: "On",
        off: "Off",
        helpContent: "1. Choose your service (Withdrawal or Transfer).\n2. Select the relevant operator.\n3. Fill in the requested information.\n4. Click confirm to launch the USSD call.\n5. Validate with your secret code on your phone.",
        whatsappContact: "WhatsApp Contact: +261 34 83 617 22"
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
