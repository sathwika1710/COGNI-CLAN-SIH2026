# ============================================================
# COGNICARE - COGNITIVE SCREENING ROUTES
# ============================================================

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import CognitiveScreening, User


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/cognitive-screenings",
    tags=["Cognitive Screening"],
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ============================================================
# REQUEST SCHEMA
# ============================================================

class CognitiveScreeningCreate(BaseModel):

    user_id: int

    score: int = Field(
        ge=0,
        le=36,
    )

    max_score: int = Field(
        ge=1,
        le=36,
    )

    percentage: int = Field(
        ge=0,
        le=100,
    )

    result_category: str

    answers: List[int]


# ============================================================
# CREATE SCREENING RESULT
# ============================================================

@router.post("/")
def create_cognitive_screening(
    screening: CognitiveScreeningCreate,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Check whether user exists
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == screening.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )


    # --------------------------------------------------------
    # Validate answers
    # --------------------------------------------------------

    if len(screening.answers) != 12:

        raise HTTPException(
            status_code=400,
            detail="Exactly 12 symptom answers are required.",
        )


    for answer in screening.answers:

        if answer not in [0, 1, 2, 3]:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Each answer must be "
                    "0, 1, 2, or 3."
                ),
            )


    # --------------------------------------------------------
    # Create database record
    # --------------------------------------------------------

    new_screening = CognitiveScreening(

        user_id=screening.user_id,

        score=screening.score,

        max_score=screening.max_score,

        percentage=screening.percentage,

        result_category=screening.result_category,

        answers=screening.answers,

    )


    db.add(new_screening)

    db.commit()

    db.refresh(new_screening)


    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {

        "message":
            "Cognitive screening result saved successfully.",

        "screening_id":
            new_screening.id,

        "user_id":
            new_screening.user_id,

        "score":
            new_screening.score,

        "max_score":
            new_screening.max_score,

        "percentage":
            new_screening.percentage,

        "result_category":
            new_screening.result_category,

        "answers":
            new_screening.answers,

        "screened_at":
            new_screening.screened_at,

    }
# ============================================================
# GET LATEST SCREENING RESULT
# ============================================================

@router.get("/user/{user_id}/latest")
def get_latest_cognitive_screening(
    user_id: int,
    db: Session = Depends(get_db),
):

    screening = (
        db.query(CognitiveScreening)
        .filter(
            CognitiveScreening.user_id == user_id
        )
        .order_by(
            CognitiveScreening.screened_at.desc()
        )
        .first()
    )


    if not screening:

        raise HTTPException(
            status_code=404,
            detail="No cognitive screening found for this user.",
        )


    return {

        "id":
            screening.id,

        "user_id":
            screening.user_id,

        "score":
            screening.score,

        "max_score":
            screening.max_score,

        "percentage":
            screening.percentage,

        "result_category":
            screening.result_category,

        "answers":
            screening.answers,

        "screened_at":
            screening.screened_at,

    }