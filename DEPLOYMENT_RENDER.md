# 🚀 Guide Complet de Déploiement sur Render

Ce guide vous permettra de déployer l'application PDF CORBA sur Render en quelques minutes.

## 📋 Prérequis

- Un compte GitHub (gratuit): https://github.com
- Un compte Render (gratuit): https://render.com
- Ce projet téléchargé et prêt à être pusé sur GitHub

## 🔄 Étape 1: Préparer votre Repository GitHub

### 1.1 Créer un repository GitHub

1. Aller sur https://github.com/new
2. Créer un nouveau repository avec le nom `pdf-corba-app`
3. Ne pas initialiser avec README (on va pusher les fichiers existants)
4. Cliquer sur "Create repository"

### 1.2 Pusher le code vers GitHub

```bash
# Dans le répertoire pdf-corba-app
cd pdf-corba-app

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "Initial commit: PDF CORBA Application"

# Ajouter l'origine distante
git remote add origin https://github.com/VOTRE_USERNAME/pdf-corba-app.git

# Renommer la branche en main
git branch -M main

# Pusher vers GitHub
git push -u origin main
```

Remplacer `VOTRE_USERNAME` par votre username GitHub.

## 🛠️ Étape 2: Configurer Render

### 2.1 Créer un nouveau service Web

1. Aller sur https://dashboard.render.com
2. Se connecter avec GitHub (ou créer un compte Render)
3. Cliquer sur **New +** en haut à droite
4. Sélectionner **Web Service**
5. Autoriser Render à accéder à vos repositories GitHub
6. Chercher et sélectionner `pdf-corba-app`
7. Cliquer sur "Connect"

### 2.2 Configurer les paramètres du service

Sur la page de création du service, remplir:

**Informations de base:**
- **Name**: `pdf-corba-app` (ou votre nom préféré)
- **Environment**: `Java` (sélectionner dans le dropdown)
- **Region**: Choisir la région la plus proche (ex: `Frankfurt` pour l'Europe)
- **Branch**: `main`

**Configuration de la construction:**

À côté de **Build Command**, entrer:
```bash
mvn clean package
```

À côté de **Start Command**, entrer:
```bash
java -Xmx512m -Xms256m -jar target/pdf-corba-app-1.0.0.jar
```

**Plan:**
- Sélectionner **Free** ou **Starter** selon vos besoins

### 2.3 Ajouter les variables d'environnement

Scroll vers le bas et cliquer sur **Advanced** pour afficher plus d'options.

Ajouter les variables d'environnement suivantes:

```
ENVIRONMENT=prod
PORT=10000
API_PASSWORD=votre-mot-de-passe-securise
UPLOAD_DIR=/tmp/uploads
JAVA_OPTS=-Xmx512m -Xms256m
LOG_LEVEL=INFO
```

**Important**: Render change automatiquement le `PORT` assigné. Ne modifiez pas `PORT=10000`.

### 2.4 Déployer

Cliquer sur le bouton **Create Web Service** bleu en bas de la page.

Render va maintenant:
1. Cloner votre repository
2. Installer les dépendances
3. Compiler le projet Maven
4. Lancer l'application

Cela prendra environ **3-5 minutes** la première fois.

## ✅ Étape 3: Vérifier le déploiement

### 3.1 Voir les logs

Une fois le déploiement commencé, vous verrez les logs en direct. Chercher le message:

```
[main] c.p.PdfCorbaApplication : Started PdfCorbaApplication in X.XXX seconds (JVM running for Y.YYY)
```

Cela signifie que le serveur a démarré avec succès.

### 3.2 Accéder à l'application

Une fois le déploiement terminé (voyant vert), vous verrez une URL comme:

```
https://pdf-corba-app.onrender.com
```

**Cliquer sur cette URL** pour accéder à votre application!

### 3.3 Tester la santé du service

Aller sur: `https://pdf-corba-app.onrender.com/api/pdf/health`

Vous devriez voir:
```json
{
  "success": true,
  "message": "Service disponible",
  "data": null
}
```

## 🔄 Étape 4: Mises à jour et re-déploiement

Chaque fois que vous pushez du code sur GitHub, Render re-déploiera automatiquement.

```bash
# Faire des changements
# Commiter et pusher
git add .
git commit -m "Mise à jour: message de changement"
git push origin main

# Render détectera automatiquement et redéploiera
```

Vous pouvez voir le statut de déploiement dans le dashboard Render.

## 🛡️ Sécurité Supplémentaire

### Changier le mot de passe API

Dans le dashboard Render:
1. Aller dans **Environment**
2. Cliquer sur la variable `API_PASSWORD`
3. Modifier avec un nouveau mot de passe fort
4. Cliquer sur "Save"
5. Le service redémarrera automatiquement

Mot de passe recommandé: au minimum 16 caractères avec majuscules, minuscules et chiffres.

```
Exemple: P9@kL2#mN5*qR7$tV4!wX8
```

### Activer les DNS personnalisés

Pour utiliser votre propre domaine (ex: pdf.monsite.com):

1. Dans le dashboard Render, aller dans **Settings**
2. Chercher **Custom Domain**
3. Entrer votre domaine
4. Suivre les instructions pour mettre à jour vos DNS

## 📊 Monitoring et Logs

### Accéder aux logs

Dans le dashboard Render:
1. Sélectionner votre service `pdf-corba-app`
2. Cliquer sur l'onglet **Logs**
3. Les logs sont affichés en temps réel

### Erreurs courantes

**"Heap space" error**:
```
java.lang.OutOfMemoryError: Java heap space
```

**Solution**: Augmenter la mémoire dans START_COMMAND:
```bash
java -Xmx1024m -Xms512m -jar target/pdf-corba-app-1.0.0.jar
```

**"Port already in use"**:
Render assigne automatiquement un port. Ne pas forcer le PORT.

**"Timeout during build"**:
Les builds Maven peuvent être longs. Render a une limite. Ajouter:
```xml
<!-- Dans pom.xml -->
<properties>
    <maven.compiler.failOnError>true</maven.compiler.failOnError>
</properties>
```

## 💾 Stockage des Fichiers

**Important**: Les fichiers uploadés sont stockés dans `/tmp/uploads` qui est **temporaire**.

Pour une utilisation en production, vous devriez:

### Option 1: Render Disks (recommandé)
1. Dans le dashboard, aller dans **Settings**
2. Cliquer sur **Add Disk**
3. Configurer un disque persistant
4. Mettre à jour `UPLOAD_DIR` à pointer vers ce disque

### Option 2: Stockage cloud externe
Intégrer AWS S3, Google Cloud Storage, etc.

## 🔧 Dépannage Déploiement

### Le build échoue

1. Vérifier les logs pour l'erreur exacte
2. S'assurer que `pom.xml` est correct
3. Essayer localement: `mvn clean package`
4. Pusher un fix et laisser Render re-builder

### L'application démarre mais crash

1. Vérifier les logs pour l'exception
2. S'assurer que toutes les dépendances sont dans `pom.xml`
3. Vérifier les variables d'environnement

### Les fichiers uploadés disparaissent

C'est normal avec le plan Free. Utiliser un disque persistant (voir section Stockage).

## 📈 Optimisations pour Production

### 1. Ajouter un cache header
Modifier `PdfController.java` pour ajouter les headers de cache.

### 2. Compresser les réponses
Ajouter dans `application.properties`:
```properties
server.compression.enabled=true
server.compression.min-response-size=1024
```

### 3. Configurer une CDN
Render supporte les CDNs. Voir la documentation Render pour les détails.

### 4. Monitoring avancé
Ajouter Spring Boot Actuator pour des métriques détaillées:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

## 📞 Support Render

Problèmes avec Render?
- Voir: https://render.com/docs
- Forum: https://render.com/community
- Email: support@render.com

## ✨ Prochaines Étapes

Maintenant que vous êtes déployé:

1. **Tester toutes les fonctionnalités**
   - Upload un PDF
   - Fusionner des PDFs
   - Extraire du texte
   - Etc.

2. **Configurer un domaine personnalisé**
   - Voir section "Activer les DNS personnalisés"

3. **Ajouter une authentification**
   - Implémenter OAuth2 avec GitHub/Google

4. **Monitorer l'utilisation**
   - Vérifier les logs régulièrement
   - Surveiller les performances

5. **Faire une sauvegarde**
   - Configurer un disque persistant
   - Mettre en place des backups

---

**Félicitations! Votre application PDF CORBA est maintenant en production! 🎉**

Pour toute question, consultez le README.md principal du projet.
