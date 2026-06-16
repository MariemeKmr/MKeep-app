# MKeep - Gestionnaire de tâches gamifié

Un gestionnaire de tâches un peu comme Notion mais en plus fun : chaque tâche terminée
rapporte de l'**XP**, fait monter de **niveau**, entretient des **streaks** (jours
consécutifs) et débloque des **succès**. L'objectif : rendre la productivité aussi
satisfaisante qu'un jeu.

## Stack

| Côté            | Techno                            |
|-----------------|-----------------------------------|
| Frontend        | Next.js + TypeScript + Tailwind   |
| Backend         | FastAPI (Python) + SQLAlchemy 2.0 |
| Base de données | MySQL 8                           |
| Auth            | JWT (Bearer)                      |

## Architecture

```
MKeep-app/
├── docker-compose.yml      # MySQL + Adminer en local
├── render.yaml             # déploiement backend (Render, gratuit)
├── backend/                # API FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py         # app FastAPI + CORS + démarrage
│       ├── config.py       # variables d'environnement
│       ├── database.py     # connexion SQLAlchemy
│       ├── models.py       # User, Task, Achievement...
│       ├── schemas.py      # validation Pydantic
│       ├── security.py     # bcrypt + JWT
│       ├── deps.py         # get_current_user
│       ├── gamification.py # MOTEUR : XP, niveaux, streaks, succès
│       ├── seed.py         # catalogue des succès
│       └── routers/        # auth / tasks / stats / achievements
└── frontend/               # Next.js (étape suivante)
```

## Lancer en local

### 1. Base de données (Docker)
```bash
docker compose up -d
# MySQL sur localhost:3306, Adminer sur http://localhost:8080
```

### 2. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                
uvicorn app.main:app --reload
```
API sur http://localhost:8000 - **documentation interactive sur http://localhost:8000/docs**

## Le moteur de jeu (gamification.py)

- **XP par tâche** : basse = 10, moyenne = 20, haute = 35 (+10 si terminée avant l'échéance)
- **Niveaux** : courbe croissante (niveau 2 = 100 XP, niveau 3 = +150, etc.)
- **Streaks** : +1 par jour consécutif avec au moins une tâche terminée
- **10 succès** : premiers pas, séries, paliers de niveau, lève-tôt / oiseau de nuit…

## API principale

| Méthode  | Route                   | Description                                  |
|----------|-------------------------|----------------------------------------------|
| POST     | `/api/auth/register`    | Inscription → token                          |
| POST     | `/api/auth/login`       | Connexion → token                            |
| GET      | `/api/auth/me`          | Profil + XP/niveau                           |
| GET/POST | `/api/tasks`            | Lister / créer des tâches                    |
| POST     | `/api/stats`            | Tableau de bord + données du graphique hebdo |
| GET      | `/api/stats/leaderboard`| Classement                                   |
| GET      | `/api/achievements`     | Succès (débloqués ou non)                    |


---
© 2026 - Marième Kamara
