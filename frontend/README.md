# MKeep - Frontend (Next.js)

Interface cartoon/jeu du gestionnaire de tâches MKeep.

## Lancer en local
```bash
cd frontend
npm install
cp .env.example .env.local   # ajuste NEXT_PUBLIC_API_URL si besoin
npm run dev
```
Ouvre http://localhost:3000 (le backend FastAPI doit tourner sur le port 8000).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (thème « sticker / cartoon »)
- Framer Motion (animations)
- canvas-confetti (fête à chaque tâche terminée)
- lucide-react (icônes)

## Déploiement Vercel
1. Importer le repo sur vercel.com, **Root Directory = `frontend`**
2. Variable d'env : `NEXT_PUBLIC_API_URL = https://mkeep-api.onrender.com`
3. Deploy.
