@echo off

REM Script de démarrage pour PDF CORBA App (Windows)

cls
echo ======================================
echo PDF CORBA Application - Démarrage
echo ======================================

REM Vérifier si Java est installé
java -version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Java n'est pas installé. Veuillez installer Java 11 ou superieur.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('java -version 2^>^&1') do set JAVA_VERSION=%%i
echo Java trouvé: %JAVA_VERSION%

REM Vérifier si Maven est installé
mvn -v >nul 2>&1
if errorlevel 1 (
    echo Erreur: Maven n'est pas installé. Veuillez installer Maven.
    pause
    exit /b 1
)

echo Maven trouvé

REM Créer le répertoire uploads
if not exist "uploads" mkdir uploads
echo Répertoire uploads créé

REM Compiler l'application
echo.
echo Compilation du projet...
call mvn clean package -DskipTests

if not exist "target\pdf-corba-app-1.0.0.jar" (
    echo Erreur lors de la compilation.
    pause
    exit /b 1
)

echo Compilation réussie
echo.
echo ======================================
echo Démarrage du serveur...
echo ======================================
echo.

REM Lancer l'application
java -Xmx512m -Xms256m -jar target\pdf-corba-app-1.0.0.jar

pause
