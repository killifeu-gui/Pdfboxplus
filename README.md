# 📄 PDF CORBA Application

Une application web moderne et sécurisée pour manipuler les fichiers PDF en temps réel via une API REST construite avec Java, Spring Boot et Apache PDFBox.

## 🎯 Fonctionnalités

- ✅ **Créer des PDF** - Générer des PDF avec du texte
- ✅ **Fusionner des PDFs** - Combiner plusieurs PDF en un seul document
- ✅ **Diviser des PDFs** - Séparer un PDF en pages individuelles
- ✅ **Extraire des pages** - Sélectionner un intervalle de pages
- ✅ **Supprimer des pages** - Retirer des pages spécifiques
- ✅ **Protéger avec mot de passe** - Ajouter une protection au PDF
- ✅ **Convertir en images** - Transformer chaque page en image PNG
- ✅ **Extraire du texte** - Récupérer tout le texte du PDF

## 📋 Prérequis

### Installation locale
- **Java 11+** ([Télécharger](https://adoptopenjdk.net/))
- **Maven 3.6+** ([Télécharger](https://maven.apache.org/download.cgi))
- **Git** (optionnel, pour cloner le projet)

### Déploiement Render
- Un compte **Render** gratuit ou payant ([render.com](https://render.com))
- Un compte **GitHub** (pour connecter le repository)

## 🚀 Installation et Lancement Local

### 1. Extraire le projet
```bash
unzip pdf-corba-app.zip
cd pdf-corba-app
```

### 2. Démarrer l'application

#### Sur Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

#### Sur Windows
```bash
start.bat
```

#### Ou manuellement
```bash
mvn clean package
java -Xmx512m -Xms256m -jar target/pdf-corba-app-1.0.0.jar
```

### 3. Accéder à l'application
L'application sera accessible à:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api/pdf

## 📁 Structure du Projet

```
pdf-corba-app/
├── src/
│   ├── main/
│   │   ├── java/com/pdfcorba/
│   │   │   ├── PdfCorbaApplication.java          # Point d'entrée
│   │   │   ├── controller/
│   │   │   │   └── PdfController.java            # API REST
│   │   │   ├── service/
│   │   │   │   └── PdfService.java               # Logique métier
│   │   │   └── dto/
│   │   │       └── ResponseDto.java              # DTO
│   │   └── resources/
│   │       ├── application.properties            # Configuration
│   │       └── static/
│   │           └── index.html                    # Interface web
│   └── test/                                      # Tests unitaires
├── pom.xml                                        # Configuration Maven
├── Procfile                                       # Configuration Render
├── .env.example                                   # Exemple d'environnement
├── .gitignore                                     # Fichiers ignorés
├── start.sh                                       # Script Linux/Mac
├── start.bat                                      # Script Windows
└── README.md                                      # Ce fichier
```

## 🔌 API Endpoints

### Upload PDF
```bash
POST /api/pdf/upload
Content-Type: multipart/form-data

# Réponse:
{ "success": true, "message": "Fichier uploadé", "data": "filename.pdf" }
```

### Créer un PDF
```bash
POST /api/pdf/create?text=Your+text
# Crée un PDF avec le texte fourni
```

### Fusionner des PDFs
```bash
POST /api/pdf/merge?files=file1.pdf,file2.pdf,file3.pdf
# Fusionne les PDFs spécifiés
```

### Diviser un PDF
```bash
POST /api/pdf/split?file=document.pdf
# Divise le PDF en pages individuelles
```

### Extraire des pages
```bash
POST /api/pdf/extract-pages?file=document.pdf&startPage=2&endPage=5
# Extrait les pages 2 à 5
```

### Supprimer des pages
```bash
POST /api/pdf/delete-pages?file=document.pdf&pageNumbers=1,3,5
# Supprime les pages 1, 3 et 5
```

### Ajouter un mot de passe
```bash
POST /api/pdf/add-password?file=document.pdf&password=secret123
# Protège le PDF avec un mot de passe
```

### Convertir en images
```bash
POST /api/pdf/to-images?file=document.pdf
# Convertit chaque page en image PNG
```

### Extraire le texte
```bash
POST /api/pdf/extract-text?file=document.pdf
# Extrait tout le texte du PDF
```

### Télécharger un fichier
```bash
GET /api/pdf/download/{filename}
# Télécharge le fichier spécifié
```

### Vérifier la santé du service
```bash
GET /api/pdf/health
# Vérifie que le service est actif
```

## 🛡️ Sécurité

- ✅ Validation des extensions de fichiers (PDF uniquement)
- ✅ Limitation de la taille des fichiers (50MB max)
- ✅ Isolation des fichiers uploadés
- ✅ Gestion d'erreurs robuste
- ✅ Logs détaillés pour le debugging
- ✅ CORS configuré de manière sécurisée

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` basé sur `.env.example`:

```bash
# Environnement (dev/prod)
ENVIRONMENT=prod

# Port du serveur
PORT=8080

# Mot de passe API
API_PASSWORD=your-secure-password

# Répertoire des uploads
UPLOAD_DIR=uploads

# Configuration Java
JAVA_OPTS=-Xmx512m -Xms256m

# Niveau de log
LOG_LEVEL=INFO
```

### Configuration Spring Boot

Modifiez `src/main/resources/application.properties` pour personnaliser:
- Port du serveur
- Taille max des fichiers
- Timeout des sessions
- Profils Spring actifs

## 📦 Dépendances Principales

- **Spring Boot 3.0.6** - Framework web
- **Apache PDFBox 3.0.0** - Manipulation de PDFs
- **Spring Security** - Sécurité
- **Jackson** - Sérialisation JSON
- **Apache Commons IO** - Utilitaires fichiers

Voir `pom.xml` pour la liste complète.

## 📊 Exemple d'utilisation Frontend

```javascript
// Upload et créer un PDF
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/pdf/upload', {
    method: 'POST',
    body: formData
});

const data = await response.json();
console.log(data.data); // Nom du fichier uploadé

// Extraire des pages
const extractResponse = await fetch(
    `/api/pdf/extract-pages?file=${data.data}&startPage=1&endPage=3`,
    { method: 'POST' }
);
```

## 🚢 Déploiement sur Render

### 1. Préparer le projet

```bash
# Initialiser un repository Git (si nécessaire)
git init
git add .
git commit -m "Initial commit"

# Pusher sur GitHub
git remote add origin https://github.com/votre-username/pdf-corba-app.git
git branch -M main
git push -u origin main
```

### 2. Créer un service sur Render

1. Aller sur https://dashboard.render.com
2. Cliquer sur **New +** → **Web Service**
3. Connecter votre repository GitHub
4. Configurer le service:

```
Name: pdf-corba-app
Environment: Java
Build Command: mvn clean package
Start Command: java -Xmx512m -Xms256m -jar target/pdf-corba-app-1.0.0.jar
```

### 3. Configurer les variables d'environnement

Dans les **Environment Variables** de Render:

```
ENVIRONMENT=prod
PORT=8080
API_PASSWORD=your-secure-password
UPLOAD_DIR=uploads
```

### 4. Déployer

Cliquer sur **Deploy**. Le déploiement prendra 2-5 minutes.

L'application sera accessible à:
```
https://pdf-corba-app.onrender.com
```

## 📝 Logs et Débugage

Vérifier les logs en temps réel:

```bash
# Logs locaux
tail -f logs/application.log

# Sur Render, voir l'onglet "Logs" du dashboard
```

Niveaux de log configurables dans `.env`:
- `ERROR` - Erreurs critiques
- `WARN` - Avertissements
- `INFO` - Informations générales
- `DEBUG` - Détails de débugage

## 🐛 Troubleshooting

### "Java not found"
```bash
# Installer Java
# Windows: https://adoptopenjdk.net/
# Linux: sudo apt-get install openjdk-11-jdk
# Mac: brew install java11
```

### "Maven not found"
```bash
# Installer Maven
# Windows: Télécharger depuis maven.apache.org
# Linux: sudo apt-get install maven
# Mac: brew install maven
```

### "Port 8080 already in use"
```bash
# Utiliser un autre port
PORT=3000 java -jar target/pdf-corba-app-1.0.0.jar

# Ou tuer le processus
# Linux/Mac: lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Windows: netstat -ano | findstr :8080 | findstr LISTENING
```

### "Out of Memory"
Augmenter la mémoire Java:
```bash
java -Xmx1024m -Xms512m -jar target/pdf-corba-app-1.0.0.jar
```

### "PDFBox error"
Vérifier que les PDFs sont valides et non corrompus.

## 💡 Optimisations et Bonnes Pratiques

- ✅ Code bien factorisé et DRY (Don't Repeat Yourself)
- ✅ Utilisation des annotations Spring pour l'inversion de dépendances
- ✅ Gestion d'erreurs cohérente avec DTOs de réponse
- ✅ Isolation des dépendances (Service, Controller, DTO)
- ✅ Frontend moderne avec CSS Grid et Flexbox
- ✅ API RESTful suivant les conventions HTTP
- ✅ Validation des entrées et des fichiers
- ✅ Logs structurés avec SLF4J

## 📄 License

MIT - Libre d'utilisation

## 👨‍💻 Support et Contribution

Pour les problèmes, suggestions ou contributions:
1. Ouvrir une issue sur GitHub
2. Créer une pull request
3. Contacter l'équipe de support

## 🔄 Mises à jour

Pour mettre à jour les dépendances:
```bash
mvn versions:display-dependency-updates
mvn clean package
```

## 🎓 Ressources Utiles

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Apache PDFBox Guide](https://pdfbox.apache.org/docs/)
- [Render Documentation](https://render.com/docs)
- [Maven Documentation](https://maven.apache.org/guides/)

---

**Créé avec ❤️ pour simplifier la manipulation de PDFs**

Version: 1.0.0
Last Updated: 2026-05-22
