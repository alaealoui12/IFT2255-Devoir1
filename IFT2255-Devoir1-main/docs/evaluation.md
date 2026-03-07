---
title: Évaluation et tests
---

<style>
    @media screen and (min-width: 76em) {
        .md-sidebar--primary {
            display: none !important;
        }
    }
</style>
## Oracles de tests – TDD (version mise à jour pour le devoir3)

Cette section décrit, pour chaque cas d’utilisation couvert par les tests unitaires, au moins un scénario de test formalisé.
Pour chaque test, on précise les entrées, le résultat attendu et les effets de bord attendus.

---

### CU5 – Consulter les résultats académiques d’un cours

#### Test CU5.1 – Cours inexistant

- Cas d’utilisation couvert  
  CU5 Consulter les résultats académiques

- Entrées  
  Appel à ResultatService.getBySigle("COURSE_INEXISTANT")

- Préconditions  
  Le fichier CSV des résultats ne contient aucune entrée avec le sigle "COURSE_INEXISTANT".

- Résultat attendu (valeur de retour)  
  La méthode retourne Optional.empty().

- Effets de bord attendus  
  Aucun état persistant modifié.  
  Aucune exception levée.

---

#### Test CU5.2 – Cours existant

- Cas d’utilisation couvert  
  CU5 Consulter les résultats académiques

- Entrées  
  Appel à ResultatService.getBySigle("IFT2255")

- Préconditions  
  Le fichier CSV contient une entrée correspondant au cours "IFT2255".

- Résultat attendu (valeur de retour)  
  La méthode retourne un Optional contenant un ResultatAcademique valide.

- Effets de bord attendus  
  Lecture du fichier CSV uniquement.  
  Aucun autre effet de bord.

---

#### Test CU5.3 – Sigle null

- Cas d’utilisation couvert  
  CU5 Consulter les résultats académiques (flux alternatif)

- Entrées  
  Appel à ResultatService.getBySigle(null)

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  La méthode retourne Optional.empty().

- Effets de bord attendus  
  Aucun crash.  
  Aucun accès au fichier CSV.

---

### CU6 – Vérifier l’éligibilité à un cours

#### Test CU6.1 – Échec si un prérequis est manquant

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours

- Entrées  
  Course.prerequisite_courses = ["IFT1015"]  
  EligibilityRequest.completedCourses = ["IFT1025"]  
  EligibilityRequest.cycle = "bac"

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = false  
  EligibilityResult.missingPrerequisites = ["IFT1015"]

- Effets de bord attendus  
  Aucun état persistant modifié.

---

#### Test CU6.2 – Échec si le cycle n’est pas baccalauréat

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours (règle métier)

- Entrées  
  Course.prerequisite_courses = []  
  EligibilityRequest.completedCourses = []  
  EligibilityRequest.cycle = "maitrise"

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = false  
  EligibilityResult.message = "Cours réservé au baccalauréat"

- Effets de bord attendus  
  Aucun.

---

#### Test CU6.3 – Succès lorsque toutes les conditions sont respectées

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours

- Entrées  
  Course.prerequisite_courses = ["IFT1015"]  
  EligibilityRequest.completedCourses = ["IFT1015"]  
  EligibilityRequest.cycle = "bac"

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = true  
  EligibilityResult.message = "Étudiant éligible à ce cours"

- Effets de bord attendus  
  Aucun.

---

#### Test CU6.4 – Succès sans prérequis

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours

- Entrées  
  Course.prerequisite_courses = []  
  EligibilityRequest.completedCourses = []  
  EligibilityRequest.cycle = "bac"

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = true

- Effets de bord attendus  
  Aucun.

---

#### Test CU6.5 – Échec avec plusieurs prérequis dont un manquant

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours (flux alternatif)

- Entrées  
  Course.prerequisite_courses = ["IFT1015", "IFT1025"]  
  EligibilityRequest.completedCourses = ["IFT1015"]  
  EligibilityRequest.cycle = "bac"

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = false  
  EligibilityResult.missingPrerequisites = ["IFT1025"]

- Effets de bord attendus  
  Aucun.

---

#### Test CU6.6 – Échec si le cycle est null

- Cas d’utilisation couvert  
  CU6 Vérifier l’éligibilité à un cours (validation d’entrée)

- Entrées  
  Course.prerequisite_courses = []  
  EligibilityRequest.completedCourses = []  
  EligibilityRequest.cycle = null

- Préconditions  
  Aucune.

- Résultat attendu (valeur de retour)  
  EligibilityResult.isEligible = false

- Effets de bord attendus  
  Aucun.

---

### CU7 – Gérer les avis des étudiants

#### Test CU7.1 – Récupérer uniquement les avis d’un cours donné

- Cas d’utilisation couvert  
  CU7 Consulter les avis d’un cours

- Entrées  
  Appel à AvisService.getByCourse("IFT2255")

- Préconditions  
  Le fichier JSON contient plusieurs avis, dont au moins deux pour "IFT2255".

- Résultat attendu (valeur de retour)  
  La méthode retourne une liste de taille 2 contenant uniquement des avis du cours "IFT2255".

- Effets de bord attendus  
  Lecture du fichier JSON uniquement.

---

#### Test CU7.2 – Aucun avis pour le cours demandé

- Cas d’utilisation couvert  
  CU7 Consulter les avis d’un cours (flux alternatif)

- Entrées  
  Appel à AvisService.getByCourse("IFT9999")

- Préconditions  
  Aucun avis n’existe pour ce cours.

- Résultat attendu (valeur de retour)  
  La méthode retourne une liste vide.

- Effets de bord attendus  
  Aucun.

---

#### Test CU7.3 – Ajout d’un avis

- Cas d’utilisation couvert  
  CU7 Ajouter un avis

- Entrées  
  Appel à AvisService.ajouterAvis(Avis("IFT2255", 5, 5, "Excellent", "Bob"))

- Préconditions  
  Le fichier d’avis est vide ou inexistant.

- Résultat attendu (valeur de retour)  
  Aucun retour (void).

- Effets de bord attendus  
  L’avis est persisté dans le fichier JSON.  
  Un appel ultérieur à getByCourse("IFT2255") retourne une liste contenant cet avis.