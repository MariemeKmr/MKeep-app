"""Moteur de gamification : XP, niveaux, streaks et succès.

C'est le cœur "jeu" de MKeep. Tout est centralisé ici pour rester testable
et facile à équilibrer.
"""
from __future__ import annotations

from datetime import datetime, date
from sqlalchemy.orm import Session

from .models import User, Task, TaskPriority, UserAchievement

# --- XP gagnée en terminant une tâche, selon la priorité ---
XP_BY_PRIORITY: dict[TaskPriority, int] = {
    TaskPriority.low: 10,
    TaskPriority.medium: 20,
    TaskPriority.high: 35,
}
XP_EARLY_BONUS = 10   # bonus si terminée avant la date d'échéance


# ---------------------------------------------------------------------------
# Niveaux
# ---------------------------------------------------------------------------
def xp_needed_for_level(level: int) -> int:
    """XP nécessaire pour passer de `level` à `level + 1`.

    Courbe douce et croissante : 100, 150, 200, 250, ...
    """
    return 100 + (level - 1) * 50


def level_progress(total_xp: int) -> dict:
    """Décompose l'XP totale en niveau + progression dans le niveau courant."""
    level = 1
    remaining = total_xp
    needed = xp_needed_for_level(level)
    while remaining >= needed:
        remaining -= needed
        level += 1
        needed = xp_needed_for_level(level)
    return {
        "level": level,
        "xp_into_level": remaining,
        "xp_for_next": needed,
        "total_xp": total_xp,
        "progress_pct": round(remaining / needed * 100, 1) if needed else 0.0,
    }


# ---------------------------------------------------------------------------
# Récompense d'une tâche
# ---------------------------------------------------------------------------
def compute_task_xp(task: Task) -> int:
    xp = XP_BY_PRIORITY.get(task.priority, 20)
    if task.due_date and date.today() <= task.due_date:
        xp += XP_EARLY_BONUS
    return xp


# ---------------------------------------------------------------------------
# Streaks (jours consécutifs avec au moins une tâche terminée)
# ---------------------------------------------------------------------------
def update_streak(user: User, today: date | None = None) -> None:
    today = today or date.today()
    last = user.last_completed_date
    if last == today:
        return  # déjà compté aujourd'hui
    if last is not None and (today - last).days == 1:
        user.current_streak += 1
    else:
        user.current_streak = 1
    user.last_completed_date = today
    user.longest_streak = max(user.longest_streak, user.current_streak)


# ---------------------------------------------------------------------------
# Succès / badges
# ---------------------------------------------------------------------------
def _unlocked_codes(db: Session, user: User) -> set[str]:
    rows = (
        db.query(UserAchievement.achievement_code)
        .filter(UserAchievement.user_id == user.id)
        .all()
    )
    return {r[0] for r in rows}


def check_achievements(db: Session, user: User, *, on_complete: bool = False) -> list[str]:
    """Vérifie et débloque les succès atteignables. Retourne les codes nouvellement
    débloqués (pour pouvoir les afficher côté front avec une petite fête)."""
    db.flush()  # rend visibles les changements en cours (statut de la tâche, etc.)
    already = _unlocked_codes(db, user)
    newly: list[str] = []

    done_count = (
        db.query(Task)
        .filter(Task.user_id == user.id, Task.status == "done")
        .count()
    )
    task_count = db.query(Task).filter(Task.user_id == user.id).count()
    now = datetime.now()

    def unlock(code: str):
        if code not in already:
            db.add(UserAchievement(user_id=user.id, achievement_code=code))
            newly.append(code)
            already.add(code)

    if task_count >= 1:
        unlock("first_task")
    if done_count >= 1:
        unlock("first_done")
    if done_count >= 10:
        unlock("tasks_10")
    if done_count >= 50:
        unlock("tasks_50")
    if user.current_streak >= 3:
        unlock("streak_3")
    if user.current_streak >= 7:
        unlock("streak_7")
    if user.level >= 5:
        unlock("level_5")
    if user.level >= 10:
        unlock("level_10")
    if on_complete and now.hour < 8:
        unlock("early_bird")
    if on_complete and now.hour >= 23:
        unlock("night_owl")

    return newly


def award_xp_for_task(db: Session, user: User, task: Task) -> dict:
    """Applique tout l'effet "terminer une tâche" : XP, niveau, streak, succès.

    Retourne un résumé pour le front (montée de niveau, nouveaux succès...)."""
    old_level = user.level
    gained = compute_task_xp(task)
    task.xp_reward = gained

    user.xp += gained
    progress = level_progress(user.xp)
    user.level = progress["level"]
    update_streak(user)

    newly = check_achievements(db, user, on_complete=True)

    return {
        "xp_gained": gained,
        "leveled_up": user.level > old_level,
        "new_level": user.level,
        "old_level": old_level,
        "new_achievements": newly,
        "progress": progress,
        "current_streak": user.current_streak,
    }
