# Documentation Docker - Royaume Paraiges Front PWA

Ce document explique comment construire et déployer l'application Royaume Paraiges Front en tant que PWA (Progressive Web App) avec Docker et Dokploy.

## Prérequis

- Docker installé (version 20.10 ou supérieure)
- Dokploy configuré avec Traefik
- Variables d'environnement configurées

## Configuration

### Variables d'environnement requises

L'application nécessite les variables d'environnement suivantes :

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
EXPO_PUBLIC_ENV=production
```

Voir le fichier `.env.example` pour référence.

## Architecture du Dockerfile

Le Dockerfile utilise une approche multi-stage :

1. **Stage Builder** : Installation des dépendances et construction de l'application Expo
2. **Stage Production** : Serveur Nginx léger pour servir les fichiers statiques

### Avantages

- Image finale optimisée (~50 MB avec Nginx Alpine)
- Séparation des environnements de build et production
- Support natif PWA avec service worker et manifest
- Configuration Nginx optimisée pour les SPA

### Build arguments

Le Dockerfile accepte les arguments de build suivants :

- `EXPO_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase
- `EXPO_PUBLIC_DIRECTUS_URL` : URL de votre instance Directus
- `EXPO_PUBLIC_ENV` : Environnement (par défaut: production)

## Configuration Nginx

Le fichier `nginx.conf` est configuré pour :

- **Compression Gzip** : Réduction de la taille des fichiers transférés
- **Cache des assets** : Fichiers statiques en cache 1 an
- **Service Worker** : Pas de cache pour le service worker
- **Routing SPA** : Toutes les routes servent `index.html`
- **Headers de sécurité** : Protection XSS, clickjacking, etc.
- **Health check** : Endpoint `/health` pour la surveillance

## Déploiement avec Dokploy

### Configuration dans Dokploy

1. **Créer une nouvelle application** dans Dokploy
2. **Connecter le dépôt Git** : `NeodeltaEU/royaume-paraiges-front`
3. **Configurer les variables d'environnement** dans l'interface Dokploy :
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_DIRECTUS_URL`
   - `EXPO_PUBLIC_ENV=production`

4. **Configuration du build** :
   - Build Method: Dockerfile
   - Dockerfile Path: `./Dockerfile`
   - Build Context: `.`

5. **Port exposé** : 80 (Nginx)

### Configuration Traefik

Dokploy gère automatiquement la configuration Traefik. Assurez-vous de configurer :

- **Domain** : Votre nom de domaine (ex: `app.royaume-paraiges.com`)
- **HTTPS** : Activé (Let's Encrypt)
- **Port** : 80 (port interne du conteneur)

### Health Check

Le conteneur inclut un health check qui vérifie toutes les 30 secondes via :
- Endpoint : `/health`
- Méthode : GET
- Code attendu : 200

Configuration du health check dans le Dockerfile :
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
```

## Build manuel (développement)

Si vous souhaitez construire l'image manuellement :

```bash
# Construire l'image
docker build \
  --build-arg EXPO_PUBLIC_SUPABASE_URL=${EXPO_PUBLIC_SUPABASE_URL} \
  --build-arg EXPO_PUBLIC_SUPABASE_ANON_KEY=${EXPO_PUBLIC_SUPABASE_ANON_KEY} \
  --build-arg EXPO_PUBLIC_DIRECTUS_URL=${EXPO_PUBLIC_DIRECTUS_URL} \
  --build-arg EXPO_PUBLIC_ENV=production \
  -t royaume-parashfront-pwa:latest .

# Tester localement
docker run -d \
  --name royaume-parashfront \
  -p 8080:80 \
  royaume-parashfront-pwa:latest

# Accéder à l'application
# http://localhost:8080
```

## Optimisations PWA

L'application est configurée comme une PWA complète :

1. **Service Worker** (`public/service-worker.js`) :
   - Gestion du cache des assets
   - Fonctionnement offline

2. **Manifest** (`public/manifest.json`) :
   - Métadonnées de l'application
   - Icônes pour différentes tailles
   - Configuration de l'installation

3. **Icônes** :
   - `icon-192.png` : Icône standard
   - `icon-512.png` : Icône haute résolution
   - `favicon.png` : Favicon du site

## Dépannage

### L'application ne démarre pas

1. Vérifiez les logs dans Dokploy :
   - Onglet "Logs" de votre application
   - Vérifiez les erreurs de build ou de démarrage

2. Vérifiez les variables d'environnement :
   - Toutes les variables requises sont-elles définies ?
   - Les URLs sont-elles correctes ?

### Erreurs de build

1. Dans Dokploy, essayez de reconstruire sans cache :
   - Option "Rebuild without cache"

2. Vérifiez que le Dockerfile est au bon endroit (racine du projet)

3. Vérifiez les logs de build pour identifier l'erreur

### L'application est lente

1. Vérifiez la compression Gzip :
   ```bash
   curl -H "Accept-Encoding: gzip" -I https://votre-domaine.com
   ```

2. Vérifiez le cache des assets :
   ```bash
   curl -I https://votre-domaine.com/assets/image.png
   ```

3. Utilisez les outils de développement du navigateur :
   - Network tab pour analyser les requêtes
   - Lighthouse pour l'audit de performance

### Problèmes de routing

Si certaines routes ne fonctionnent pas :

1. Vérifiez que nginx.conf contient bien :
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

2. Vérifiez que le service worker ne bloque pas les requêtes

## Monitoring

### Logs en temps réel

Dans Dokploy :
- Onglet "Logs" pour voir les logs en temps réel
- Filtrez par niveau (error, warn, info)

### Métriques

Dokploy fournit des métriques de base :
- CPU usage
- Memory usage
- Network I/O
- Nombre de requêtes

### Alertes

Configurez des alertes dans Dokploy pour :
- Health check failures
- High CPU/Memory usage
- Application crashes

## Mise à jour de l'application

Avec Dokploy, les mises à jour sont automatiques :

1. **Push sur la branche principale** : Dokploy détecte automatiquement
2. **Build automatique** : Une nouvelle image est construite
3. **Déploiement** : L'application est redéployée avec zero-downtime

Pour forcer une mise à jour manuelle :
- Cliquez sur "Redeploy" dans l'interface Dokploy

## Sécurité

### Headers de sécurité

Le fichier `nginx.conf` inclut des headers de sécurité :
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### Variables d'environnement sensibles

⚠️ **Important** :
- Ne commitez JAMAIS les fichiers `.env` dans Git
- Utilisez les variables d'environnement de Dokploy
- Les build args ne sont visibles que pendant le build

### HTTPS

Traefik gère automatiquement :
- Certificats SSL via Let's Encrypt
- Redirection HTTP → HTTPS
- Renouvellement automatique des certificats

## Support

Pour toute question ou problème :
- Créez une issue dans le dépôt GitHub
- Consultez la documentation Dokploy : https://docs.dokploy.com
- Consultez la documentation Traefik : https://doc.traefik.io/traefik/
