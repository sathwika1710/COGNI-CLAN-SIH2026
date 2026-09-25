from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import AdaptiveResponse

from ..ai.features import (
    build_transformer_sequence,
)

from ..ai.transformer_service import (
    predict_difficulty,
    explain_prediction,
)


router = APIRouter(
    prefix="/adaptive",
    tags=["Adaptive AI"],
)


@router.get(
    "/{user_id}/{game_name}",
    response_model=AdaptiveResponse,
)
def get_adaptive_difficulty(
    user_id: int,
    game_name: str,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Check user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # --------------------------------------------------------
    # Build 5-session sequence
    # --------------------------------------------------------

    sequence = build_transformer_sequence(
        db=db,
        user_id=user_id,
    )

    if sequence is None:

        raise HTTPException(
            status_code=400,
            detail=(
                "At least 5 completed game sessions "
                "are required before adaptive difficulty "
                "can be predicted."
            ),
        )

    # --------------------------------------------------------
    # Transformer prediction
    # --------------------------------------------------------

    prediction = predict_difficulty(
        sequence
    )

    # --------------------------------------------------------
    # XAI explanation
    # --------------------------------------------------------

    explanation = explain_prediction(
        sequence
    )

    # --------------------------------------------------------
    # Return complete AI result
    # --------------------------------------------------------

    return {

        "user_id": user_id,

        "game_name": game_name,

        "recommended_difficulty":
            prediction[
                "recommended_difficulty"
            ],

        "confidence":
            prediction[
                "confidence"
            ],

        "probabilities":
            prediction[
                "probabilities"
            ],

        "reason":
            prediction[
                "reason"
            ],

        "explanation":
            explanation,
    }
