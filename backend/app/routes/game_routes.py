from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import GameSession, User
from ..schemas import GameSessionCreate, GameSessionResponse


router = APIRouter(
    prefix="/game-sessions",
    tags=["Game Sessions"]
)


@router.post(
    "/",
    response_model=GameSessionResponse
)
def create_game_session(
    session_data: GameSessionCreate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == session_data.user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if session_data.difficulty not in {
        "Easy",
        "Medium",
        "Hard"
    }:
        raise HTTPException(
            status_code=400,
            detail="Difficulty must be Easy, Medium, or Hard."
        )

    if not 0 <= session_data.accuracy <= 100:
        raise HTTPException(
            status_code=400,
            detail="Accuracy must be between 0 and 100."
        )

    if session_data.response_time < 0:
        raise HTTPException(
            status_code=400,
            detail="Response time cannot be negative."
        )

    if session_data.mistakes < 0:
        raise HTTPException(
            status_code=400,
            detail="Mistakes cannot be negative."
        )

    if session_data.valence is not None:
        if not 1 <= session_data.valence <= 5:
            raise HTTPException(
                status_code=400,
                detail="Valence must be between 1 and 5."
            )

    if session_data.arousal is not None:
        if not 1 <= session_data.arousal <= 5:
            raise HTTPException(
                status_code=400,
                detail="Arousal must be between 1 and 5."
            )

    game_session = GameSession(
        user_id=session_data.user_id,
        game_name=session_data.game_name,
        difficulty=session_data.difficulty,
        accuracy=session_data.accuracy,
        score=session_data.score,
        response_time=session_data.response_time,
        mistakes=session_data.mistakes,
        accuracy_change=session_data.accuracy_change,
        valence=session_data.valence,
        arousal=session_data.arousal,
        completed=session_data.completed,
    )

    db.add(game_session)
    db.commit()
    db.refresh(game_session)

    return game_session


@router.get(
    "/user/{user_id}",
    response_model=list[GameSessionResponse]
)
def get_user_game_sessions(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return (
        db.query(GameSession)
        .filter(GameSession.user_id == user_id)
        .order_by(GameSession.played_at.desc())
        .all()
    )


@router.get(
    "/user/{user_id}/recent",
    response_model=list[GameSessionResponse]
)
def get_recent_game_sessions(
    user_id: int,
    limit: int = 5,
    db: Session = Depends(get_db)
):

    if limit < 1 or limit > 20:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 20."
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return (
        db.query(GameSession)
        .filter(GameSession.user_id == user_id)
        .order_by(GameSession.played_at.desc())
        .limit(limit)
        .all()
    )
