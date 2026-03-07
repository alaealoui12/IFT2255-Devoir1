##  Bot Discord – Avis étudiants

Ce projet est un bot Discord développé en Python avec la librairie `discord.py`.  
Il permet aux étudiants de soumettre facilement des avis sur les cours universitaires via des messages simples dans un canal Discord.

### Fonctionnement
- L’étudiant écrit un message décrivant son expérience pour un cours.
- Le bot détecte automatiquement s’il s’agit d’un avis de cours **à l’aide d’un modèle de langue (LLM)**.
- Les informations pertinentes (cours, difficulté, charge, commentaire) sont extraites par le LLM.
- Une confirmation explicite (OUI / NON) est demandée.
- Après confirmation, l’avis est envoyé à l’API REST (`POST /api/avis`).

### Intégration
- Le bot ne stocke aucune donnée localement.
- Les avis sont transmis au backend du projet pour validation et persistance.
- Le bon fonctionnement du bot est démontré dans la vidéo de présentation.

### Contexte
Projet réalisé dans le cadre du cours **IFT2255 – Génie logiciel**  
(Université de Montréal), comme interface pseudo-conversationnelle (bonus).
