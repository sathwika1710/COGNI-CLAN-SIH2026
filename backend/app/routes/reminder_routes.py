from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional

from ..database import get_db


router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"]
)


class ReminderCreate(BaseModel):
    user_id: int
    title: str
    description: Optional[str] = ""
    reminder_time: str
    completed: bool = False


# CREATE
@router.post("/")
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            INSERT INTO reminders
                (user_id, title, description, reminder_time, completed)
            VALUES
                (:user_id, :title, :description,
                 CAST(:reminder_time AS timestamp), :completed)
            RETURNING id, user_id, title, description,
                      reminder_time, completed
        """),
        {
            "user_id": reminder.user_id,
            "title": reminder.title,
            "description": reminder.description,
            "reminder_time": reminder.reminder_time,
            "completed": reminder.completed
        }
    )

    row = result.fetchone()

    db.commit()

    return {
        "message": "Reminder saved successfully",
        "reminder": {
            "id": row.id,
            "user_id": row.user_id,
            "title": row.title,
            "description": row.description,
            "reminder_time": row.reminder_time,
            "completed": row.completed
        }
    }


# GET USER REMINDERS
@router.get("/user/{user_id}")
def get_user_reminders(
    user_id: int,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT
                id,
                user_id,
                title,
                description,
                reminder_time,
                completed
            FROM reminders
            WHERE user_id = :user_id
            ORDER BY reminder_time ASC
        """),
        {
            "user_id": user_id
        }
    )

    rows = result.fetchall()

    return [
        {
            "id": row.id,
            "user_id": row.user_id,
            "title": row.title,
            "description": row.description,
            "reminder_time": row.reminder_time,
            "completed": row.completed
        }
        for row in rows
    ]


# COMPLETE / UNCOMPLETE
@router.put("/{reminder_id}/complete")
def complete_reminder(
    reminder_id: int,
    completed: bool = True,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            UPDATE reminders
            SET completed = :completed
            WHERE id = :reminder_id
            RETURNING id
        """),
        {
            "reminder_id": reminder_id,
            "completed": completed
        }
    )

    row = result.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.commit()

    return {
        "message": "Reminder updated successfully"
    }


# DELETE
@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            DELETE FROM reminders
            WHERE id = :reminder_id
            RETURNING id
        """),
        {
            "reminder_id": reminder_id
        }
    )

    row = result.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Reminder not found"
        )

    db.commit()

    return {
        "message": "Reminder deleted successfully"
    }