"""Modèles SQLAlchemy : User, Task, Achievement, UserAchievement."""
from __future__ import annotations

import enum
from datetime import datetime, date

from sqlalchemy import (
    String, Integer, Text, ForeignKey, DateTime, Date, Enum as SAEnum, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # --- Gamification ---
    xp: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    level: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_completed_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    avatar_color: Mapped[str] = mapped_column(String(20), default="#7C5CFF", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    tasks: Mapped[list["Task"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )
    achievements: Mapped[list["UserAchievement"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        SAEnum(TaskStatus), default=TaskStatus.todo, nullable=False
    )
    priority: Mapped[TaskPriority] = mapped_column(
        SAEnum(TaskPriority), default=TaskPriority.medium, nullable=False
    )
    category: Mapped[str | None] = mapped_column(String(60), nullable=True)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    due_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    xp_reward: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    owner: Mapped["User"] = relationship(back_populates="tasks")


class Achievement(Base):
    """Catalogue des succès (rempli au démarrage par seed_achievements)."""
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(40), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    description: Mapped[str] = mapped_column(String(160), nullable=False)
    icon: Mapped[str] = mapped_column(String(40), nullable=False)   # nom d'icône Lucide
    color: Mapped[str] = mapped_column(String(20), default="#FFB020", nullable=False)
    xp_bonus: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class UserAchievement(Base):
    """Succès débloqués par un utilisateur."""
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    achievement_code: Mapped[str] = mapped_column(String(40), index=True, nullable=False)
    unlocked_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="achievements")
