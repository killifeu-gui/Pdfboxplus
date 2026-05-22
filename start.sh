#!/bin/bash

# Script de démarrage pour PDF CORBA App

set -e

echo "======================================"
echo "PDF CORBA Application - Démarrage"
echo "======================================"

# Vérifier si Java est installé
if ! command -v java &> /dev/null
then
    echo "❌ Java n'est pas installé. Veuillez installer Java 11 ou supérieur."
    exit 1
fi

echo "✓ Java trouvé: $(java -version 2>&1 | head -1)"

# Vérifier si Maven est installé
if ! command -v mvn &> /dev/null
then
    echo "❌ Maven n'est pas installé. Veuillez installer Maven."
    exit 1
fi

echo "✓ Maven trouvé: $(mvn -v | head -1)"

# Créer le répertoire uploads
mkdir -p uploads
echo "✓ Répertoire uploads créé"

# Compiler l'application
echo ""
echo "Compilation du projet..."
mvn clean package -DskipTests

# Vérifier si la compilation a réussi
if [ ! -f target/pdf-corba-app-1.0.0.jar ]; then
    echo "❌ Erreur lors de la compilation."
    exit 1
fi

echo "✓ Compilation réussie"
echo ""
echo "======================================"
echo "Démarrage du serveur..."
echo "======================================"
echo ""

# Lancer l'application
java -Xmx512m -Xms256m -jar target/pdf-corba-app-1.0.0.jar
