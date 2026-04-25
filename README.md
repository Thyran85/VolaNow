# Welcome to your VolaNow 

## Get started

Install dependencies

   ```bash
   npm install
   ```

# 📱 Lancer l'application (Android - Expo Dev Client)

## 🚀 Commandes à exécuter (dans l'ordre)

```bash
# 1. Build de l'application (APK via Expo EAS)
eas build --profile development --platform android

# 👉 Installer l'application via le lien ou QR code généré

# 2. Vérifier que le téléphone est connecté
adb devices

# 3. Rediriger le port (IMPORTANT)
adb reverse tcp:8081 tcp:8081

# 4. Lancer le serveur Expo (dev client)
npx expo start --dev-client --localhost --port 8081
