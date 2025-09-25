---
title: Analyse des besoins - Cas d'utilisation
---

# Cas d'utilisation

## Vue d’ensemble

TODO: Introduction aux cas d’utilisation du système.

## Liste des cas d’utilisation

| ID   | Nom                     | Acteurs principaux | Description                                                                     |
|------|-------------------------|---------------------|--------------------------------------------------------------------------------|
| CU01 | Personnaliser les choix | Étudiant            | 1-L'étudiant accède à la section filtre de la plateforme                       |
|      |                         |                     | 2-Le système lui présente un formulaire avec différentes options (préférences  |
|      |                         |                     | centres d’intérêt, contraintes personnelles)                                   |
|      |                         |                     | 3-L’étudiant remplit le formulaire avec ses choix                              |
|      |                         |                     | 4-Le système enregistre ces informations dans la base de données               |
|      |                         |                     | 5-Par la suite, quand l’étudiant fait une recherche de cours, la plateforme    | 
|                                |                     | adapte automatiquement l’affichage en fonction du profil enregistré            |
|------|-------------------------|---------------------|--------------------------------------------------------------------------------|
| CU02 | Créer un avis étudiant  | Étudiant            | 1-L’étudiant choisit un cours qu’il a suivi et accède à la section Avis        |
|      |                         |                     | étudiants                                                                      |
|      |                         |                     | 2-Le système lui propose un formulaire pour écrire son avis (niveau de         |
|      |                         |                     | difficulte, charge de travail, rythme du cours et commentaire optionnel)       |
|      |                         |                     |                                                                                |
|      |                         |                     | 3-L’étudiant rédige son avis et le soumet                                      |
|      |                         |                     | 4-Le système enregistre l’avis                                                 |
|      |                         |                     | 5-La plateforme affiche les avis les plus représentatifs quand le nombre       |
|      |                         |                     | minimal d’avis est atteint (>=5)                                               |
|------|-------------------------|---------------------|--------------------------------------------------------------------------------|
| CU03 |  Rechercher un cours    | Étudiant            | 1-L’étudiant accède à la page de recherche de cours                            |
|      |                         |                     | 2-Le système lui propose différents filtres (code, titre ou mots-clés)         |
|      |                         |                     | 3-L’étudiant saisit un critère et lance la recherche                           |
|      |                         |                     | 4-Le système affiche les résultats avec les détails                            |
|      |                         |                     | 5-la plateforme indique clairement si l’étudiant est éligible ou non           |
|      |                         |                     | (prérequis, co-requis, cycle, contraintes de programme ou statut), pour chaque |
|      |                         |                     | cours                                                                          |


## Détail

### CU01 - Connexion

**Acteurs** : Utilisateur (principal)
**Préconditions** : 
**PostConditions** :
**Déclencheur** :   
**Dépendances** :   
**But** :
