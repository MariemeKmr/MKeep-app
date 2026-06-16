"""Routes statistiques : tableau de bord gamifié + classement."""
from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User, Task, TaskStatus
from ..schemas import StatsOut, LeaderboardEntry
from ..gamification import level_progress

router = APIRouter(prefix="/api/stats", tags=["stats"])

_DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]


@router.get("", response_model=StatsOut)
def my_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    base = db.query(Task).filter(Task.user_id == user.id)
    total = base.count()
    done = base.filter(Task.status == TaskStatus.done).count()
    todo = base.filter(Task.status == TaskStatus.todo).count()
    in_progress = base.filter(Task.status == TaskStatus.in_progress).count()

    prog = level_progress(user.xp)

    # Tâches terminées par jour sur les 7 derniers jours (pour le graphique coloré)
    today = date.today()
    start = today - timedelta(days=6)
    rows = (
        db.query(func.date(Task.completed_at), func.count())
        .filter(
            Task.user_id == user.id,
            Task.status == TaskStatus.done,
            Task.completed_at.isnot(None),
            func.date(Task.completed_at) >= start,
        )
        .group_by(func.date(Task.completed_at))
        .all()
    )
    by_day = {str(d): c for d, c in rows}
    weekly = []
    for i in range(7):
        d = start + timedelta(days=i)
        weekly.append({"day": _DAYS_FR[d.weekday()], "done": by_day.get(str(d), 0)})

    return StatsOut(
        level=prog["level"],
        xp=user.xp,
        xp_into_level=prog["xp_into_level"],
        xp_for_next=prog["xp_for_next"],
        progress_pct=prog["progress_pct"],
        current_streak=user.current_streak,
        longest_streak=user.longest_streak,
        total_tasks=total,
        done_tasks=done,
        todo_tasks=todo,
        in_progress_tasks=in_progress,
        completion_rate=round(done / total * 100, 1) if total else 0.0,
        weekly=weekly,
    )


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def leaderboard(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    top = db.query(User).order_by(User.xp.desc()).limit(10).all()
    return [
        LeaderboardEntry(
            username=u.username, level=u.level, xp=u.xp, avatar_color=u.avatar_color
        )
        for u in top
    ]
