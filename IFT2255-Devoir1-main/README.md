# Devoir 3 – IFT2255 (Génie logiciel)

Ce dépôt contient le livrable complet du **Devoir 3 – Implémentation, tests et documentation** du cours **IFT2255 – Génie logiciel** à l’Université de Montréal.

Le projet vise à développer un **outil d’aide au choix de cours pour les étudiants du DIRO**, reposant sur une **API REST** servant de façade à l’API officielle **Planifium**, enrichie par :
- des **résultats académiques agrégés**,
- des **avis étudiants** collectés via un **bot Discord**.

L’application permet d’explorer les cours, comparer des options, vérifier l’éligibilité et analyser les horaires afin de faciliter la prise de décision académique.

---

## Objectifs du Devoir 3

Le **Devoir 3** consiste à :

- Compléter l’implémentation de toutes les fonctionnalités exigées
- Implémenter une API REST robuste et validée
- Développer un jeu de tests unitaires conforme aux exigences
- Configurer Maven pour la compilation, les tests et la génération d’un JAR
- Produire une documentation claire et complète
- Préparer une démonstration fonctionnelle de l’application

---

## Fonctionnalités implémentées

### Recherche et exploration
- Recherche de cours par **sigle partiel** (ex : `IFT`)
- Recherche par **mots-clés** dans le nom ou la description
- Filtrage par **trimestre** (`H25`, `A24`, `E24`)
- Consultation des **cours d’un programme**

### Consultation détaillée
- Affichage des **horaires par trimestre**
- Distinction des **sections** et **types d’activités**
- Consultation des **résultats académiques agrégés**
- Consultation des **avis étudiants**

### Analyse et aide à la décision
- Vérification de l’**éligibilité** à un cours
- **Comparaison de deux cours**
- Création d’un **ensemble de cours** (max. 6)
- Détection des **conflits d’horaire** (bonus)

### Avis étudiants
- Collecte d’avis via un **bot Discord**
- Soumission des avis à l’API REST
- Agrégation de la difficulté et de la charge de travail

---

## Architecture générale

- **API REST (Javalin)**  
  - Façade vers l’API Planifium
  - Endpoints simplifiés et spécialisés
- **Application console (CLI)**  
  - Interaction utilisateur avec l’API
- **Bot Discord**  
  - Collecte et soumission des avis étudiants
- **Sources de données**
  - API Planifium
  - Fichiers CSV (résultats académiques)
  - Fichiers JSON (avis étudiants)

---

## Prérequis

- Java **17+**
- Maven **3.8+**
- Connexion Internet (API Planifium)
- (Optionnel) MkDocs pour visualiser la documentation

---

## Organisation du projet

text
IFT2255-Devoir3/
├── discord/ 
├── docs/ 
├── rest-api/
│   ├── src/
│   │   ├── 
│   │   └── 
│   ├── resources/
│   ├── pom.xml
│   └── README.md
├── mkdocs.yml
└── README.md

## Installation et compilation


git clone 
cd IFT2255-Devoir1/rest-api
mvn clean compile 
mvn exec:java -D exec.mainClass="com.diro.ift2255.Main"


Pour lancer la jar 
cd rest-api/
mvn clean package
java -jar target/rest-api-1.0-SNAPSHOT.jar

Pour éxécuter les tests :

cd IFT2255-Devoir3/rest-api
mvn  test 

## Lien vers la vidéo youtube de démonstration .

https://youtu.be/Zj2Tmzm4HTA?si=d2NYkGHUg6zv77T3

## d'invitation vers le serveur discord la ou les avis ont été collectés

https://discord.gg/XFYGuvuw

## Répartition des taches

tarek zerroug : Code , Tests , interface graphique , interface pseudo - conversationelle , rapport , documentation , api rest , configuration maven  , démonstration  .
Nizar Lakhder : Code ( fonctionnalités de l'application ) , Oracle des tests . 
Alae aloui : diagramme de classe , rapport , conception ( diagramme de classe ) , code .

