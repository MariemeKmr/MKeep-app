# MKeep - Gestionnaire de tâches gamifié

> Transforme ta to-do list en jeu. Chaque tâche terminée rapporte de l'XP, fait monter de niveau, entretient des séries et débloque des succès. Aussi simple qu'une liste, aussi satisfaisant qu'un jeu.

## Démo en ligne

- **Application** : https://mkeep-app.vercel.app
- **API (documentation interactive)** : https://mkeep-api.onrender.com 

### Compte de démonstration

Pour tester l'application sans créer de compte :

| Champ | Valeur |
|-------|--------|
| Email | `user@user.com` |
| Mot de passe | `MonTestUser` |

*(Tu peux aussi créer ton propre compte en quelques secondes.)*

## À propos

MKeep est un gestionnaire de tâches pensé comme un **jeu de productivité**, plus simple qu'un Notion mais plus motivant qu'une simple liste. L'idée : rendre chaque tâche accomplie réellement gratifiante grâce à un système de progression complet (XP, niveaux, séries, succès), une interface colorée façon dessin animé, des animations qui rebondissent et des confettis à chaque tâche terminée.

Le projet est un **fullstack complet** : interface Next.js, API REST FastAPI, base MySQL, authentification JWT, le tout déployé gratuitement.

## Fonctionnalités

- **Authentification** sécurisée (inscription / connexion par JWT)
- **Gestion de tâches** : création, édition, priorités, catégories, complétion
- **Système d'XP** : 10 / 20 / 35 points selon la priorité (+ bonus avant échéance)
- **Niveaux** à courbe de progression croissante
- **Streaks** : suivi des jours consécutifs d'activité
- **10 succès** à débloquer (premiers pas, séries, paliers de niveau, lève-tôt / oiseau de nuit…)
- **Tableau de bord** : statistiques, taux de réussite et graphique hebdomadaire coloré
- **Confettis & modale de level-up** pour célébrer la progression
- Interface responsive, style « sticker / cartoon », sans aucune image (logo en police bubble, icônes vectorielles)

## Stack technique

| Couche | Technologies |
|--------|--------------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, canvas-confetti, lucide-react |
| Backend | FastAPI (Python), SQLAlchemy 2.0, PyMySQL, JWT (PyJWT), bcrypt |
| Base de données | MySQL 8 |
| Déploiement | Vercel (front) · Render (API) · Aiven (MySQL) |

## Architecture

```
MKeep-app/
├── backend/            # API FastAPI
│   └── app/
│       ├── main.py         # app + CORS + démarrage
│       ├── models.py       # User, Task, Achievement
│       ├── gamification.py  # moteur XP / niveaux / streaks / succès
│       ├── security.py     # bcrypt + JWT
│       └── routers/        # auth, tasks, stats, achievements
└── frontend/           # Next.js (interface cartoon gamifiée)
    ├── app/                # pages (accueil, login, register, dashboard)
    ├── components/         # XPBar, TaskCard, LevelUpModal, WeeklyChart…
    └── lib/                # client API + types
```

## Lancer en local

Prérequis : Python 3.11+, Node.js 18+, MySQL (ou XAMPP).

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # puis renseigne DATABASE_URL
uvicorn app.main:app --reload
```
API sur http://localhost:8000 — documentation sur http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
copy .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```
Application sur http://localhost:3000

## Déploiement (100 % gratuit)

- **MySQL** → Aiven (plan Free, always-on)
- **Backend** → Render (Docker, plan Free) via le fichier `render.yaml`
- **Frontend** → Vercel (Root Directory = `frontend`)

Les variables d'environnement clés : `DATABASE_URL`, `DB_SSL`, `JWT_SECRET`, `CORS_ORIGINS` (backend) et `NEXT_PUBLIC_API_URL` (frontend).

---

Développé par **Marième Kamara** - *Gestionnaire de tâches interactif*.