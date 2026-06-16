"""Routes des tâches : CRUD + complétion gamifiée."""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..deps import get_current_user
from ..models import User, Task, TaskStatus
from ..schemas import TaskCreate, TaskUpdate, TaskOut, CompleteResult
from ..gamification import award_xp_for_task, check_achievements, level_progress

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


def _get_owned_task(task_id: int, db: Session, user: User) -> Task:
    task = db.get(Task, task_id)
    if not task or task.user_id != user.id:
        raise HTTPException(status_code=404, detail="Tâche introuvable")
    return task


@router.get("", response_model=list[TaskOut])
def list_tasks(
    status: TaskStatus | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    q = db.query(Task).filter(Task.user_id == user.id)
    if status is not None:
        q = q.filter(Task.status == status)
    return q.order_by(Task.position.asc(), Task.created_at.desc()).all()


@router.post("", response_model=TaskOut, status_code=201)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = Task(user_id=user.id, **payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    # Succès "première tâche"
    check_achievements(db, user)
    db.commit()
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = _get_owned_task(task_id, db, user)
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.post("/{task_id}/complete", response_model=CompleteResult)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Termine une tâche et déclenche tout le moteur de jeu (XP, niveau, streak,
    succès). C'est l'action la plus satisfaisante de l'app."""
    task = _get_owned_task(task_id, db, user)
    if task.status == TaskStatus.done:
        raise HTTPException(status_code=400, detail="Tâche déjà terminée")

    task.status = TaskStatus.done
    task.completed_at = datetime.now()

    result = award_xp_for_task(db, user, task)
    db.commit()
    db.refresh(task)

    return CompleteResult(task=task, **result)


@router.post("/{task_id}/reopen", response_model=TaskOut)
def reopen_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = _get_owned_task(task_id, db, user)
    task.status = TaskStatus.todo
    task.completed_at = None
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    task = _get_owned_task(task_id, db, user)
    db.delete(task)
    db.commit()
