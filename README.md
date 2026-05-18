# 📱 VolaNow - Services USSD (Madagascar)

VolaNow est une application mobile cross-platform (Android & iOS) conçue pour simplifier les transactions USSD quotidiennes à Madagascar (MVola, Orange Money, Airtel Money) sans connexion Internet obligatoire, incluant un scanner intelligent de cartes de recharge.

---

## 🛠️ Installation & Démarrage

Toutes les commandes doivent être exécutées dans le dossier contenant le code de l'application mobile :

```bash
cd App-Mobile
```

### 1. Installer les dépendances
```bash
npm install
```

---

## 💻 Développement Local

Pour lancer l'application en mode développement en utilisant **Expo Dev Client** sur votre smartphone physique (Android) :

### 🚀 Étapes dans l'ordre :

1. **Build de l'application (Dev Client)**
   ```bash
   eas build --profile development --platform android
   ```
   *👉 Installez l'APK généré par Expo sur votre téléphone à l'aide du QR Code ou du lien fourni.*

2. **Brancher le téléphone en USB et vérifier la connexion**
   ```bash
   adb devices
   ```

3. **Rediriger le port Metro (TRÈS IMPORTANT)**
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

4. **Lancer le serveur de développement**
   ```bash
   npx expo start --dev-client --localhost --port 8081
   ```

---

## 📦 Builds & Distribution (EAS Build)

### 🤖 Android (Génération d'APK de test / Preview)
Pour générer un APK autonome qui écoute le canal de mise à jour `preview` (OTA) :
```bash
eas build --profile preview --platform android
```
Une fois le build terminé, téléchargez et installez l'APK sur votre smartphone.

### 🍎 iOS (Préparation & Build)
L'application est 100% compatible iOS. Pour tester sur iOS :
1. **Via Expo Go** (Idéal en dev) :
   - Installez **Expo Go** depuis l'App Store.
   - Lancez le serveur expo : `npx expo start`.
   - Scannez le QR Code avec l'appareil photo de votre iPhone.
2. **Via EAS Build** (Pour générer un fichier `.ipa`) :
   ```bash
   eas build --profile preview --platform ios
   ```

---

## 🚀 Mises à jour Over-The-Air (EAS Update)

Grâce à Expo Updates, vous pouvez déployer instantanément des changements visuels, des corrections de bugs ou de nouvelles traductions sur **Android et iOS** en même temps, sans avoir à refaire un build complet ou à réinstaller l'APK (Android) ou l'application (iOS) !

### Pousser une mise à jour sur le canal `preview` :
```bash
eas update --branch preview --message "Votre description des changements"
```

> ⚠️ **IMPORTANT :** 
> - Les modifications de composants React (JS/TSX), de styles ou de fichiers de traduction (`i18n.ts`) peuvent être déployées instantanément via `eas update`.
> - **Tout ajout, suppression ou mise à jour de dépendance native** (ex: ajout de `expo-ocr-kit`, `expo-camera`, etc., qui modifient les fichiers Android/iOS natifs) **nécessite impérativement un nouveau build complet** (`eas build`) pour être effectif sur le téléphone.

---

## 📁 Structure du Projet

L'application suit la structure de navigation moderne d'**Expo Router** :

- **`app/`** : L'ensemble des écrans et la navigation (dossier structuré par fonctionnalités).
  - `(home)/` : Accueil, Historique des transactions et Paramètres.
  - `(withdrawal)/` : Page de Retrait de cash.
  - `(transfer)/` : Page de Transfert d'argent rapide.
  - `(recharge)/` : Scanner intelligent de cartes de recharge.
- **`components/ui/`** : Composants graphiques réutilisables haut de gamme (ex: `ConfirmModal` stylisé).
- **`context/`** : Gestion des états globaux de l'app (Thème clair/sombre, Historique persistant, Vibrations tactiles).
- **`constants/`** :
  - `ussd.ts` : Génération et logique des codes USSD malgaches.
  - `i18n.ts` : Gestion du multilingue (Français, Anglais, Malagasy).
  - `theme.ts` & `config.ts` : Configuration générale et style premium.
