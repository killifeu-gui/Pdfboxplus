# 📦 Guide Complet d'Installation

Ce guide vous aidera à installer et lancer l'application PDF CORBA sur votre ordinateur.

## 🖥️ Système Requis

- **Windows 10+**, **macOS 10.14+**, ou **Linux** (Ubuntu 18.04+)
- **Au minimum 4 GB de RAM**
- **2 GB d'espace disque libre**
- **Connexion Internet** (pour télécharger les dépendances)

## 📥 Étape 1: Télécharger et Extraire

### 1.1 Extraire le ZIP

**Sur Windows:**
- Clic droit sur `pdf-corba-app.zip`
- Sélectionner "Extraire tout..."
- Choisir le dossier de destination
- Cliquer sur "Extraire"

**Sur macOS:**
- Double-cliquer sur `pdf-corba-app.zip`
- Le dossier s'extraira automatiquement

**Sur Linux:**
```bash
unzip pdf-corba-app.zip
cd pdf-corba-app
```

## ☕ Étape 2: Installer Java

### 2.1 Vérifier si Java est installé

Ouvrir un terminal/PowerShell et exécuter:
```bash
java -version
```

Si vous voyez une erreur, Java n'est pas installé.

### 2.2 Installer Java 11+

**Option 1: Télécharger Oracle JDK**
1. Aller sur https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
2. Télécharger la version pour votre système
3. Installer en suivant les instructions

**Option 2: Utiliser un JDK gratuit (Recommandé)**

**Windows:**
1. Télécharger depuis: https://adoptopenjdk.net/
2. Télécharger "OpenJDK 11 (LTS)" avec HotSpot
3. Lancer l'installateur
4. Suivre les instructions
5. Laisser coché "Set JAVA_HOME variable"

**macOS:**
```bash
# Si Homebrew est installé
brew install openjdk@11
brew link openjdk@11
```

Sans Homebrew:
1. Télécharger depuis: https://adoptopenjdk.net/
2. Télécharger le DMG
3. Installer en glissant dans Applications

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
```

**Linux (Fedora/CentOS):**
```bash
sudo dnf install java-11-openjdk
```

### 2.3 Vérifier l'installation

Exécuter à nouveau:
```bash
java -version
```

Vous devriez voir quelque chose comme:
```
openjdk version "11.0.x" 2023-XX-XX
OpenJDK Runtime Environment ...
```

## 🔧 Étape 3: Installer Maven

### 3.1 Vérifier si Maven est installé

```bash
mvn -version
```

Si vous voyez une erreur, Maven n'est pas installé.

### 3.2 Installer Maven

**Windows:**
1. Télécharger depuis: https://maven.apache.org/download.cgi
2. Télécharger "Binary zip archive"
3. Extraire le ZIP (ex: C:\maven)
4. Ajouter à Path:
   - Ouvrir "Variables d'environnement"
   - Cliquer sur "Nouvelles variables d'environnement"
   - Nom: `MAVEN_HOME`
   - Valeur: `C:\maven\apache-maven-3.8.1` (votre chemin)
   - Ajouter `%MAVEN_HOME%\bin` à la variable `Path`
5. Redémarrer le terminal

**macOS:**
```bash
# Avec Homebrew
brew install maven

# Ou télécharger manuellement
cd /Library/Java
# Extraire le ZIP téléchargé
```

**Linux:**
```bash
sudo apt-get install maven
# ou
sudo yum install maven
```

### 3.3 Vérifier l'installation

```bash
mvn -version
```

Vous devriez voir:
```
Apache Maven 3.8.1 ...
```

## 🚀 Étape 4: Lancer l'Application

### 4.1 Méthode recommandée (Script automatique)

**Sur Windows:**
```bash
# Double-cliquer sur "start.bat"
# ou en ligne de commande:
start.bat
```

**Sur macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

Le script va:
1. Vérifier que Java et Maven sont installés
2. Créer le dossier uploads
3. Compiler le projet (premier démarrage = plus long)
4. Lancer l'application

### 4.2 Méthode manuelle

```bash
# Aller dans le dossier du projet
cd pdf-corba-app

# Compiler et packager
mvn clean package

# Lancer l'application
java -Xmx512m -Xms256m -jar target/pdf-corba-app-1.0.0.jar
```

## 📱 Étape 5: Accéder à l'Application

Une fois que vous voyez dans la console:
```
Started PdfCorbaApplication in 4.231 seconds
```

L'application est prête! 

Ouvrir un navigateur et aller à:
```
http://localhost:8080
```

Vous verrez l'interface web pour manipuler vos PDFs.

## 🧪 Étape 6: Tester l'Application

### Test rapide:

1. **Upload un PDF** → Chercher "Télécharger un PDF"
2. **Créer un PDF** → Chercher "Créer un PDF"
3. **Extraire du texte** → Chercher "Extraire le texte"

Chaque opération devrait afficher un message de succès.

## 🛑 Étape 7: Arrêter l'Application

Pour arrêter le serveur:

**Sur Windows:**
- Fermer la fenêtre de terminal
- Ou appuyer sur `Ctrl+C`

**Sur macOS/Linux:**
- Appuyer sur `Ctrl+C`

## 🔧 Dépannage Installation

### Problème: "Java not found"
```
Le chemin d'accès spécifié est introuvable / command not found: java
```

**Solutions:**
1. Vérifier que Java est installé: `java -version`
2. Redémarrer le terminal après installation
3. Ajouter Java au PATH (voir section Installation Java)
4. Utiliser le chemin complet: `/usr/libexec/java_home` (Mac)

### Problème: "Maven not found"
```
mvn: command not found
```

**Solutions:**
1. Installer Maven (voir section Installation Maven)
2. Redémarrer le terminal après installation
3. Ajouter Maven au PATH

### Problème: "Port 8080 already in use"
```
Bind exception: Address already in use
```

**Solutions:**
```bash
# Linux/Mac: Trouver et tuer le processus
lsof -i :8080
kill -9 <PID>

# Windows: Ouvrir PowerShell en admin
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process

# Ou utiliser un autre port
PORT=3000 java -jar target/pdf-corba-app-1.0.0.jar
```

### Problème: "Out of Memory"
```
java.lang.OutOfMemoryError: Java heap space
```

**Solutions:**
```bash
# Augmenter la mémoire allouée
java -Xmx1024m -Xms512m -jar target/pdf-corba-app-1.0.0.jar

# Fermer d'autres applications
# Redémarrer l'ordinateur
```

### Problème: "Build fails"
```
BUILD FAILURE
```

**Solutions:**
```bash
# Nettoyer et refaire la construction
mvn clean package -DskipTests

# Mettre à jour les dépendances
mvn clean install

# Si cela ne marche pas:
# Supprimer .m2 et ~/.m2/repository (cache Maven)
```

### Problème: Fichiers uploadés manquants
```
Fichier not found après upload
```

**Solutions:**
- Vérifier que le dossier `uploads` existe
- Vérifier les permissions du dossier
- Vérifier l'espace disque disponible

## 📝 Configuration Personnalisée

### Changer le port

**Méthode 1: Variable d'environnement**
```bash
PORT=3000 java -jar target/pdf-corba-app-1.0.0.jar
```

**Méthode 2: Fichier application.properties**
Modifier `src/main/resources/application.properties`:
```properties
server.port=3000
```

### Augmenter la taille max des fichiers

Modifier `src/main/resources/application.properties`:
```properties
server.servlet.multipart.max-file-size=100MB
server.servlet.multipart.max-request-size=100MB
```

### Changer le répertoire des uploads

Modifier `src/main/resources/application.properties` ou:
```bash
UPLOAD_DIR=/chemin/personnalise java -jar target/pdf-corba-app-1.0.0.jar
```

## 🔐 Configuration Sécurité

### Ajouter une authentification

1. Modifier le mot de passe dans `.env`:
```
API_PASSWORD=votre-mot-de-passe-fort
```

2. Utiliser ce mot de passe pour les appels API:
```bash
curl -H "Authorization: Basic $(echo -n admin:votre-mot-de-passe | base64)" \
  http://localhost:8080/api/pdf/health
```

## 📚 Documentation Supplémentaire

- **README.md** - Documentation complète
- **DEPLOYMENT_RENDER.md** - Guide de déploiement Render
- **pom.xml** - Dépendances et configuration Maven
- **application.properties** - Configuration Spring Boot

## ✅ Checklist de Vérification

- [x] Java 11+ installé
- [x] Maven installé
- [x] ZIP extrait
- [x] Dossier `pdf-corba-app` créé
- [x] Terminal ouvert dans le bon dossier
- [x] `start.sh` ou `start.bat` exécuté
- [x] Application accessible à http://localhost:8080
- [x] Test d'upload d'un PDF réussi

## 🎓 Prochaines Étapes

1. **Tester toutes les fonctionnalités**
2. **Configurer le déploiement sur Render** (voir DEPLOYMENT_RENDER.md)
3. **Lire la documentation complète** (README.md)
4. **Explorer le code source**
5. **Ajouter vos propres fonctionnalités**

## 💬 Besoin d'Aide?

- Vérifier les **logs** dans la console
- Consulter **README.md** pour les erreurs courantes
- Chercher sur **Google** pour des erreurs spécifiques
- Vérifier les **Issues GitHub** du projet

---

**Bravo! Vous êtes prêt à utiliser PDF CORBA! 🎉**

Pour toute question supplémentaire, consultez le README.md ou DEPLOYMENT_RENDER.md.
