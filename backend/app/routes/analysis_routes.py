from collections import Counter

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, GameSession
from ..ai.features import calculate_emotional_summary, build_transformer_sequence
from ..ai.transformer_service import predict_difficulty, explain_prediction


router = APIRouter(
    prefix="/analysis",
    tags=["Performance Analysis"],
)


@router.get("/{user_id}")
def get_performance_analysis(
    user_id: int,
    db: Session = Depends(get_db),
):
    # --------------------------------------------------------
    # Check user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    # --------------------------------------------------------
    # Get completed sessions
    # --------------------------------------------------------

    sessions = (
        db.query(GameSession)
        .filter(
            GameSession.user_id == user_id,
            GameSession.completed == True,
        )
        .order_by(GameSession.played_at.asc())
        .all()
    )

    if not sessions:
        return {
            "user_id": user_id,
            "games_played": 0,
            "average_score": 0,
            "average_accuracy": 0,
            "average_response_time": 0,
            "total_mistakes": 0,
            "best_game": None,
            "performance_level": "No data",
            "performance_trend": "No data",
            "difficulty_distribution": {},
            "emotional_engagement": {
                "average_valence": None,
                "average_arousal": None,
                "sessions_with_emotional_data": 0,
            },
            "recent_activity": [],
            "note": (
                "Performance analytics are activity-based "
                "and are not a medical diagnosis."
            ),
        }

    # --------------------------------------------------------
    # Basic metrics
    # --------------------------------------------------------

    games_played = len(sessions)

    average_score = (
        sum(float(s.score) for s in sessions)
        / games_played
    )

    average_accuracy = (
        sum(float(s.accuracy) for s in sessions)
        / games_played
    )

    average_response_time = (
        sum(float(s.response_time) for s in sessions)
        / games_played
    )

    total_mistakes = sum(
        int(s.mistakes)
        for s in sessions
    )

    # --------------------------------------------------------
    # Best game
    # --------------------------------------------------------

    game_scores = {}

    for session in sessions:

        game_scores.setdefault(
            session.game_name,
            []
        )

        game_scores[
            session.game_name
        ].append(
            float(session.accuracy)
        )

    game_averages = {
        game: sum(scores) / len(scores)
        for game, scores in game_scores.items()
    }

    best_game = max(
        game_averages,
        key=game_averages.get,
    )

    # --------------------------------------------------------
    # Performance level
    # --------------------------------------------------------

    if average_accuracy >= 85:
        performance_level = "High"

    elif average_accuracy >= 65:
        performance_level = "Moderate"

    else:
        performance_level = "Needs Support"

    # --------------------------------------------------------
    # Performance trend
    # --------------------------------------------------------

    if len(sessions) >= 2:

        midpoint = len(sessions) // 2

        first_half = sessions[:midpoint]
        second_half = sessions[midpoint:]

        first_average = (
            sum(
                float(s.accuracy)
                for s in first_half
            )
            / len(first_half)
        )

        second_average = (
            sum(
                float(s.accuracy)
                for s in second_half
            )
            / len(second_half)
        )

        difference = second_average - first_average

        if difference >= 5:
            performance_trend = "Improving"

        elif difference <= -5:
            performance_trend = "Declining"

        else:
            performance_trend = "Stable"

    else:
        performance_trend = "Insufficient data"

    # --------------------------------------------------------
    # Difficulty distribution
    # --------------------------------------------------------

    difficulty_distribution = dict(
        Counter(
            s.difficulty
            for s in sessions
        )
    )

    # --------------------------------------------------------
    # Emotional engagement
    # --------------------------------------------------------

    emotional_summary = calculate_emotional_summary(
        db=db,
        user_id=user_id,
    )

    # --------------------------------------------------------
    # Recent activity
    # --------------------------------------------------------

    recent_sessions = sessions[-5:]

    recent_activity = []

    for session in reversed(recent_sessions):

        recent_activity.append({
            "game_name": session.game_name,
            "difficulty": session.difficulty,
            "accuracy": round(
                float(session.accuracy),
                2,
            ),
            "score": round(
                float(session.score),
                2,
            ),
            "response_time": round(
                float(session.response_time),
                2,
            ),
            "mistakes": int(
                session.mistakes
            ),
            "valence": session.valence,
            "arousal": session.arousal,
            "played_at": (
                session.played_at.isoformat()
                if session.played_at
                else None
            ),
        })

    # --------------------------------------------------------
    # Final response
    # --------------------------------------------------------

    return {
        "user_id": user_id,

        "games_played": games_played,

        "average_score": round(
            average_score,
            2,
        ),

        "average_accuracy": round(
            average_accuracy,
            2,
        ),

        "average_response_time": round(
            average_response_time,
            2,
        ),

        "total_mistakes": total_mistakes,

        "best_game": {
            "name": best_game,
            "average_accuracy": round(
                game_averages[best_game],
                2,
            ),
        },

        "performance_level": performance_level,

        "performance_trend": performance_trend,

        "difficulty_distribution":
            difficulty_distribution,

        "emotional_engagement":
            emotional_summary,

        "recent_activity":
            recent_activity,

        "note": (
            "Performance analytics describe observed "
            "game activity and self-reported emotional "
            "engagement. They are not a medical diagnosis."
        ),
    }
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..ai.features import build_transformer_sequence
from ..ai.transformer_service import predict_difficulty, explain_prediction


router = APIRouter(
    prefix="/analysis",
    tags=["Performance Analysis"],
)


@router.get("/ml/{user_id}")
def get_ml_analysis(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    sequence = build_transformer_sequence(
        db=db,
        user_id=user_id,
    )

    if sequence is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "At least 5 game sessions are required "
                "for Transformer analysis."
            ),
        )

    prediction = predict_difficulty(
        sequence
    )

    explanation = explain_prediction(
        sequence
    )

    return {
        "user_id": user_id,
        "model": "CogniCare Transformer",
        "recommended_difficulty":
            prediction["recommended_difficulty"],
        "confidence":
            prediction["confidence"],
        "probabilities":
            prediction["probabilities"],
        "reason":
            prediction["reason"],
        "explanation":
            explanation,
        "note": (
            "This is an AI-based activity recommendation "
            "and not a medical diagnosis."
        ),
    }
@router.get("/model-info")
def get_model_info():

    return {
        "model_name": "CogniCare Transformer",
        "model_type": (
            "Transformer Encoder for longitudinal "
            "game-performance sequences"
        ),
        "sequence_length": 5,
        "input_features": [
            "accuracy",
            "score",
            "response_time",
            "mistakes",
            "accuracy_change",
            "game_type",
            "difficulty",
        ],
        "output_classes": [
            "Easy",
            "Medium",
            "Hard",
        ],
        "purpose": (
            "Adaptive cognitive-game difficulty "
            "recommendation based on observed "
            "game-performance patterns."
        ),
        "test_accuracy": 0.8650,
        "test_precision": 0.8705,
        "test_recall": 0.8650,
        "test_f1": 0.8657,
        "data_type": "Synthetic prototype training data",
        "clinical_claim": False,
    }
