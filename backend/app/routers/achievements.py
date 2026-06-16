"""Routes des succès : catalogue + état (débloqué ou non) pour l'utilisateur."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User, Achievement, UserAchievement
from ..schemas import AchievementOut

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


@router.get("", response_model=list[AchievementOut])
def list_achievements(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    catalogue = db.query(Achievement).order_by(Achievement.id).all()
    unlocked = {
        ua.achievement_code: ua.unlocked_at
        for ua in db.query(UserAchievement).filter(
            UserAchievement.user_id == user.id
        )
    }
    return [
        AchievementOut(
            code=a.code,
            name=a.name,
            description=a.description,
            icon=a.icon,
            color=a.color,
            unlocked=a.code in unlocked,
            unlocked_at=unlocked.get(a.code),
        )
        for a in catalogue
    ]
