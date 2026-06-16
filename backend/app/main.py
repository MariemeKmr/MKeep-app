"""Point d'entrée de l'API MKeep."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine, SessionLocal
from .seed import seed_achievements
# Import des modèles pour que create_all les connaisse
from . import models  # noqa: F401
from .routers import auth, tasks, stats, achievements


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Création des tables + seed au démarrage
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_achievements(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="MKeep API",
    description="Gestionnaire de tâches gamifié - XP, niveaux, streaks et succès.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(stats.router)
app.include_router(achievements.router)


@app.get("/", tags=["health"])
def root():
    return {"app": "MKeep API", "status": "ok", "docs": "/docs"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
