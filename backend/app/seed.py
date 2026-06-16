"""Remplit le catalogue des succès au démarrage (idempotent)."""
from sqlalchemy.orm import Session

from .models import Achievement

ACHIEVEMENTS = [
    {"code": "first_task", "name": "Premier pas", "description": "Créer ta toute première tâche", "icon": "Sparkles", "color": "#7C5CFF"},
    {"code": "first_done", "name": "Ça commence !", "description": "Terminer ta première tâche", "icon": "CheckCircle2", "color": "#27C281"},
    {"code": "tasks_10", "name": "Productif", "description": "Terminer 10 tâches", "icon": "Zap", "color": "#FFB020"},
    {"code": "tasks_50", "name": "Machine de guerre", "description": "Terminer 50 tâches", "icon": "Rocket", "color": "#FF6B6B"},
    {"code": "streak_3", "name": "En feu", "description": "3 jours d'affilée", "icon": "Flame", "color": "#FF8A3D"},
    {"code": "streak_7", "name": "Inarrêtable", "description": "7 jours d'affilée", "icon": "Flame", "color": "#FF4D4D"},
    {"code": "level_5", "name": "Vétéran", "description": "Atteindre le niveau 5", "icon": "Star", "color": "#FFD23F"},
    {"code": "level_10", "name": "Légende", "description": "Atteindre le niveau 10", "icon": "Crown", "color": "#9B5DE5"},
    {"code": "early_bird", "name": "Lève-tôt", "description": "Terminer une tâche avant 8h", "icon": "Sunrise", "color": "#4CC9F0"},
    {"code": "night_owl", "name": "Oiseau de nuit", "description": "Terminer une tâche après 23h", "icon": "Moon", "color": "#5C6BC0"},
]


def seed_achievements(db: Session) -> None:
    existing = {a.code for a in db.query(Achievement.code).all()}
    for item in ACHIEVEMENTS:
        if item["code"] not in existing:
            db.add(Achievement(**item))
    db.commit()
