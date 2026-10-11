# Titan Linux Desktop Lite

Lanceur Android pour un bureau Debian + XFCE via Termux et Termux X11.
Cible : Motorola G Pure, Android 12+, appareils à faible RAM.

## 1. Structure

- `src/` : interface React + TypeScript (tableau de bord, paquets, commandes, favoris)
- `src/termux.ts` : pont vers le plugin natif et liste blanche des paquets
- `android-plugin/` : plugin Capacitor Kotlin (détection, RUN_COMMAND, ouverture)
- `termux-scripts/` : scripts exécutés dans Termux (bootstrap, Debian, XFCE, bureau, paquets)

## 2. Prérequis sur le téléphone

Installe Termux et Termux X11 depuis F-Droid ou GitHub (les versions du Play Store sont obsolètes).

## 3. Scripts Termux

Copie le dossier `termux-scripts/` vers `~/titan` dans Termux, par exemple via le dossier Téléchargements :

    termux-setup-storage
Décompresse d'abord le ZIP dans le dossier Téléchargements. Si le dossier extrait s'appelle `titan-linux-desktop-lite`, lance dans Termux :

    termux-setup-storage
    mkdir -p ~/titan
    cp ~/storage/downloads/titan-linux-desktop-lite/termux-scripts/*.sh ~/titan/
    chmod +x ~/titan/*.sh
    ~/titan/bootstrap-termux.sh

Si Android a extrait le ZIP dans un autre emplacement, adapte uniquement le chemin de la commande `cp`.

Ensuite, accorde à l'application la permission « Exécuter des commandes Termux » dans les paramètres Android.

## 4. Compilation de l'application Android

    npm install
    npx cap add android
    # Copie android-plugin/TitanTermuxPlugin/TitanTermuxPlugin.kt dans
    # android/app/src/main/java/com/titan/linuxdesktop/
    # Remplace MainActivity.kt par android-plugin/MainActivity-snippet.kt
    # Ajoute le contenu d'AndroidManifest-additions.xml dans AndroidManifest.xml
    npm run android:debug

L'APK se trouve dans `android/app/build/outputs/apk/debug/`.

## 5. Limites connues

- Termux ne renvoie pas la sortie des commandes à l'application : les résultats s'affichent dans la session Termux.
- Le gestionnaire de fichiers et le terminal intégré ne sont pas encore implémentés.
- Le téléchargement de Debian peut prendre plusieurs minutes et n'a pas encore de barre de progression.
- Non testé sur Motorola G Pure : à valider sur l'appareil.


## 6. Méthode simple depuis un téléphone : GitHub Actions

Le dépôt contient maintenant `.github/workflows/build-apk.yml`. Après avoir envoyé les fichiers du projet dans un dépôt GitHub, ouvre l'onglet **Actions**, sélectionne **Build Titan Android APK**, puis **Run workflow**. Quand l'exécution est terminée, ouvre le résultat et télécharge l'artefact `titan-linux-desktop-lite-debug-apk`, puis extrais-le pour obtenir `app-debug.apk`. Cette APK est une version de test (debug), pas une version signée pour publication sur Play Store.
