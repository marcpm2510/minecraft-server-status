# Moniteur de Serveurs Minecraft

Une application web moderne pour surveiller l'état et les informations de vos serveurs Minecraft en temps réel.

![Capture d'écran de l'application](screenshot.png)

## Fonctionnalités

- 🔍 **Surveillance en temps réel** des serveurs Minecraft
- 🚦 **Affichage de l'état** des serveurs (en ligne/hors ligne)
- 👥 **Informations détaillées** sur les serveurs (nombre de joueurs, version, etc.)
- ⏱️ **Auto-actualisation configurable** (30s, 1min, 5min, 10min)
- ➕ **Ajout et suppression** de serveurs personnalisés
- 💾 **Sauvegarde locale** des serveurs ajoutés
- 📊 **Compteur** de serveurs en ligne/hors ligne
- 📱 **Interface responsive** adaptée à tous les appareils

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (Vanilla)
- Node.js
- API mcsrvstat.us pour récupérer les informations des serveurs

## Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-nom/minecraft-server-status.git
   cd minecraft-server-status
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Utilisation

### Démarrer l'application

Vous avez plusieurs options pour démarrer l'application :

1. **Démarrer uniquement le serveur web** (recommandé) :
   ```bash
   npm run web-only
   ```

2. **Démarrer le serveur web et l'API locale** :
   ```bash
   npm start
   ```

3. **Vérifier rapidement le statut des serveurs depuis la ligne de commande** :
   ```bash
   npm run check
   ```

### Accéder à l'application

Ouvrez votre navigateur et accédez à :
```
http://localhost:8091/
```

### Utiliser l'application

1. **Ajouter un serveur** : Entrez l'adresse du serveur dans le champ de texte et cliquez sur "Ajouter".
2. **Actualiser un serveur** : Cliquez sur le bouton "Actualiser" sur la carte du serveur.
3. **Actualiser tous les serveurs** : Cliquez sur le bouton "Actualiser tous" en haut de la page.
4. **Supprimer un serveur** : Cliquez sur le bouton "Supprimer" sur la carte du serveur.
5. **Configurer l'auto-actualisation** : Sélectionnez l'intervalle souhaité dans le menu déroulant.

## Structure du projet

- `monitor.html` - Interface web principale
- `server.js` - Serveur web Node.js
- `start-web.js` - Script pour démarrer uniquement le serveur web
- `api.js` - API locale pour vérifier le statut des serveurs
- `start.js` - Script pour démarrer à la fois le serveur web et l'API
- `check_minecraft_servers.js` - Script pour vérifier le statut des serveurs depuis la ligne de commande
- `404.html` - Page d'erreur 404
- `styles.css` - Feuille de style CSS
- `package.json` - Configuration du projet et scripts npm

## Limitations

- L'application utilise l'API publique mcsrvstat.us, qui peut avoir des limites de taux de requêtes
- Certains serveurs peuvent ne pas renvoyer toutes les informations disponibles
- Les serveurs avec des configurations spéciales peuvent ne pas être correctement détectés

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.