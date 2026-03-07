---
title: Conception - Diagrammes UML
---

# Diagrammes UML

## Diagrammes de classes

- Modèle de données orienté objet
![Diagramme de classe](../../besoins/diagrammes/Class Diagram4.jpg)


Ce diagramme de classes représente l’architecture complète de l’application de consultation et d’analyse de cours, structurée selon une approche en couches inspirée de MVC, avec une séparation nette entre les contrôleurs, les services, les modèles et les utilitaires.

L’application est organisée autour de plusieurs packages principaux.

⸻

Couche modèle (model)

La couche modèle regroupe les classes représentant les entités métier manipulées par le système.

La classe Course représente un cours universitaire. Elle contient les informations essentielles telles que le sigle, le nom, les crédits, la description, les prérequis, les conditions de disponibilité et les horaires. Elle constitue l’entité centrale autour de laquelle s’articulent plusieurs fonctionnalités de l’application.

La classe ResultatAcademique modélise les résultats statistiques d’un cours, incluant notamment la moyenne, l’écart-type, le nombre de participants et le nombre de trimestres observés. Ces données sont utilisées pour informer les étudiants sur la performance académique associée à un cours.

La classe EligibilityRequest encapsule les informations fournies par l’étudiant pour vérifier son admissibilité à un cours, soit la liste des cours complétés et le cycle d’études.

La classe EligibilityResult représente le résultat de cette vérification. Elle indique si l’étudiant est éligible, quels prérequis sont manquants le cas échéant, et fournit un message explicatif.

La classe Avis représente un avis étudiant sur un cours. Elle contient le cours concerné, la difficulté perçue, la charge de travail, un commentaire textuel et l’auteur de l’avis.

La classe User représente un utilisateur du système, identifié par un identifiant, un nom et une adresse courriel.

⸻

Couche service (service)

La couche service contient la logique métier de l’application.

La classe CourseService est responsable de la récupération des cours depuis l’API Planifium via un client HTTP. Elle offre des méthodes pour rechercher des cours, obtenir les détails d’un cours, comparer plusieurs cours et vérifier l’éligibilité d’un étudiant à un cours donné.

La classe ProgramService permet d’interroger les programmes d’études à partir de l’API distante et de récupérer les cours associés à un programme.

La classe ResultatService gère l’accès aux résultats académiques stockés localement dans un fichier CSV. Elle fournit une méthode permettant d’obtenir les résultats associés à un sigle de cours donné.

La classe AvisService gère la persistance et la consultation des avis étudiants. Elle permet d’ajouter des avis, de récupérer tous les avis ou de filtrer les avis par cours à partir d’un fichier JSON.

La classe UserService gère les utilisateurs du système. Elle offre des opérations de création, consultation, mise à jour et suppression d’utilisateurs, stockés en mémoire.

L’interface IService définit un contrat générique pour les services exposant des opérations CRUD, favorisant la cohérence et la réutilisabilité.

_____

Couche contrôleur (controller)

La couche contrôleur agit comme point d’entrée entre l’interface utilisateur (console ou API) et la logique métier.

La classe CourseController orchestre les interactions liées aux cours, notamment la recherche, la consultation des détails, la comparaison de cours et la vérification d’éligibilité.

La classe ProgramController gère les requêtes associées aux programmes d’études.

La classe ResultatController expose les fonctionnalités liées à la consultation des résultats académiques.

La classe AvisController permet de consulter et d’ajouter des avis étudiants.

La classe UserController gère les requêtes liées aux utilisateurs.

Ces contrôleurs dépendent directement des services correspondants et ne contiennent pas de logique métier complexe.

⸻

Couche utilitaire (util)

La couche utilitaire regroupe les classes techniques transversales.

La classe HttpClientApi encapsule les appels HTTP vers les API externes et centralise la logique de communication réseau.

La classe ValidationUtil fournit des méthodes de validation, notamment pour vérifier le format des adresses courriel.

La classe ResponseUtil permet de formater les réponses et les messages d’erreur de manière uniforme.

⸻

Couche configuration et exécution

La classe Routes configure les routes de l’application et relie les chemins aux contrôleurs appropriés.

La classe MainConsole représente l’interface utilisateur en ligne de commande et constitue le point d’interaction principal avec l’utilisateur.

La classe Main contient la méthode main et constitue le point d’entrée de l’application.

⸻


## Diagrammes de séquence

![Diagramme de sequence](../../besoins/diagrammes/diagrammedesequence1.jpg)
L’étudiant demande la recherche d’un cours par sigle.
Le contrôleur transmet la requête au service, qui interroge l’API Planifium, transforme les données reçues, puis renvoie la liste des cours trouvés.
Le contrôleur affiche soit les résultats, soit un message d’erreur si aucun cours n’est disponible.

![Diagramme de sequence](../../besoins/diagrammes/diagrammedesequence2.jpg)
L’étudiant envoie une liste de sigles à comparer.
Le contrôleur appelle le service, qui récupère les informations de chaque cours via l’API Planifium.
Une fois les données réunies, le contrôleur affiche le tableau comparatif, ou un message d’erreur si la liste contient moins de deux cours.

![Diagramme de sequence](../../besoins/diagrammes/diagrammedesequence3.jpg)
L’étudiant soumet un avis.
Le contrôleur envoie l’avis au service, qui le valide.
Si l’avis est valide, il est enregistré et envoyé au bot Discord, puis un message de confirmation est affiché.
Si l’avis est invalide, un message d’erreur est affiché à l’étudiant.