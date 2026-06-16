"""Schémas Pydantic (validation entrée/sortie de l'API)."""
from __future__ import annotations

from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from .models import TaskStatus, TaskPriority


# ---------- Auth ----------
class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=6, max_length=128)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- User ----------
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    username: str
    xp: int
    level: int
    current_streak: int
    longest_streak: int
    avatar_color: str


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=2, max_length=50)
    avatar_color: str | None = Field(default=None, max_length=20)


# ---------- Task ----------
class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    priority: TaskPriority = TaskPriority.medium
    category: str | None = Field(default=None, max_length=60)
    due_date: date | None = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    category: str | None = Field(default=None, max_length=60)
    due_date: date | None = None
    position: int | None = None


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    status: TaskStatus
    position: int
    xp_reward: int
    created_at: datetime
    completed_at: datetime | None


# ---------- Gamification ----------
class CompleteResult(BaseModel):
    task: TaskOut
    xp_gained: int
    leveled_up: bool
    old_level: int
    new_level: int
    current_streak: int
    new_achievements: list[str]
    progress: dict


class AchievementOut(BaseModel):
    code: str
    name: str
    description: str
    icon: str
    color: str
    unlocked: bool
    unlocked_at: datetime | None = None


class StatsOut(BaseModel):
    level: int
    xp: int
    xp_into_level: int
    xp_for_next: int
    progress_pct: float
    current_streak: int
    longest_streak: int
    total_tasks: int
    done_tasks: int
    todo_tasks: int
    in_progress_tasks: int
    completion_rate: float
    weekly: list[dict]   # [{ "day": "Lun", "done": 3 }, ...]


class LeaderboardEntry(BaseModel):
    username: str
    level: int
    xp: int
    avatar_color: str
