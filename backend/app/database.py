"""Connexion SQLAlchemy à MySQL.

En local (XAMPP) la connexion est en clair. En production, les hébergeurs MySQL
managés comme Aiven imposent le TLS : on l'active automatiquement quand l'URL
pointe vers Aiven, ou quand DB_SSL=true.
"""
import ssl as _ssl

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from .config import settings

_connect_args: dict = {}
if settings.DB_SSL or "aivencloud.com" in settings.DATABASE_URL:
    # Active le chiffrement TLS (sans vérifier le certificat, suffisant ici).
    _ctx = _ssl.create_default_context()
    _ctx.check_hostname = False
    _ctx.verify_mode = _ssl.CERT_NONE
    _connect_args = {"ssl": _ctx}

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # évite les connexions mortes (utile en serverless)
    pool_recycle=280,
    future=True,
    connect_args=_connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dépendance FastAPI : fournit une session DB et la ferme proprement."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
