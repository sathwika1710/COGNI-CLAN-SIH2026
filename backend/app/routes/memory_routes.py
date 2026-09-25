from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional

from ..database import get_db


router = APIRouter(
    prefix="/memories",
    tags=["Memories"]
)


class MemoryCreate(BaseModel):
    user_id: int
    title: str
    person: Optional[str] = ""
    date: Optional[str] = ""
    category: Optional[str] = "Personal"
    text: str
    photo: Optional[str] = ""


# ============================================================
# CREATE MEMORY
# ============================================================

@router.post("/")
def create_memory(
    memory_data: MemoryCreate,
    db: Session = Depends(get_db)
):

    description = (
        f"Person: {memory_data.person}\n"
        f"Category: {memory_data.category}\n"
        f"{memory_data.text}"
    )

    result = db.execute(
        text("""
            INSERT INTO memories
                (user_id, title, description, memory_date)
            VALUES
                (:user_id, :title, :description, :memory_date)
            RETURNING id, user_id, title, description,
                      created_at, memory_date
        """),
        {
            "user_id": memory_data.user_id,
            "title": memory_data.title,
            "description": description,
            "memory_date": memory_data.date or None
        }
    )

    row = result.fetchone()

    db.commit()

    return {
        "message": "Memory saved successfully",
        "memory": {
            "id": row.id,
            "user_id": row.user_id,
            "title": row.title,
            "description": row.description,
            "created_at": row.created_at,
            "memory_date": row.memory_date,
            "person": memory_data.person,
            "category": memory_data.category,
            "text": memory_data.text,
            "photo": memory_data.photo
        }
    }


# ============================================================
# GET USER MEMORIES
# ============================================================

@router.get("/user/{user_id}")
def get_user_memories(
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
                created_at,
                memory_date
            FROM memories
            WHERE user_id = :user_id
            ORDER BY id DESC
        """),
        {
            "user_id": user_id
        }
    )

    rows = result.fetchall()

    memories = []

    for row in rows:

        description = row.description or ""

        person = ""
        category = "Personal"
        memory_text = description

        lines = description.split("\n")

        for line in lines:

            if line.startswith("Person:"):
                person = line.replace(
                    "Person:", ""
                ).strip()

            elif line.startswith("Category:"):
                category = line.replace(
                    "Category:", ""
                ).strip()

            else:
                if line.strip():
                    memory_text = line.strip()


        memories.append({
            "id": row.id,
            "user_id": row.user_id,
            "title": row.title,
            "description": row.description,
            "created_at": row.created_at,
            "memory_date": row.memory_date,

            "person": person,
            "category": category,
            "text": memory_text,
            "photo": ""
        })

    return memories


# ============================================================
# DELETE MEMORY
# ============================================================

@router.delete("/{memory_id}")
def delete_memory(
    memory_id: int,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            DELETE FROM memories
            WHERE id = :memory_id
            RETURNING id
        """),
        {
            "memory_id": memory_id
        }
    )

    row = result.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail="Memory not found"
        )

    db.commit()

    return {
        "message": "Memory deleted successfully"
    }