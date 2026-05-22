#!/bin/bash

# Script de nettoyage des fichiers temporaires et anciens

echo "========================================="
echo "Nettoyage des fichiers temporaires"
echo "========================================="

# Définir les répertoires
UPLOADS_DIR="uploads"
DAYS_OLD=7

# Vérifier si le répertoire uploads existe
if [ ! -d "$UPLOADS_DIR" ]; then
    echo "Le répertoire uploads n'existe pas."
    exit 0
fi

# Compter les fichiers avant
BEFORE=$(find "$UPLOADS_DIR" -type f 2>/dev/null | wc -l)
echo "Fichiers avant nettoyage: $BEFORE"

# Supprimer les fichiers plus vieux que DAYS_OLD jours
find "$UPLOADS_DIR" -type f -mtime +$DAYS_OLD -delete

# Supprimer les répertoires vides
find "$UPLOADS_DIR" -type d -empty -delete

# Compter les fichiers après
AFTER=$(find "$UPLOADS_DIR" -type f 2>/dev/null | wc -l)
echo "Fichiers après nettoyage: $AFTER"

# Afficher l'espace libéré
du -sh "$UPLOADS_DIR"

echo ""
echo "✓ Nettoyage terminé"
