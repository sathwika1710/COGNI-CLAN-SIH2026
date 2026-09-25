from sqlalchemy.orm import Session

from ..models import GameSession


def get_recent_sessions(
    db: Session,
    user_id: int,
    limit: int = 5,
):
    """
    Fetch the most recent game sessions for a user.

    Sessions are returned in chronological order:
    oldest ? newest.

    The Transformer requires exactly 5 sessions.
    """

    sessions = (
        db.query(GameSession)
        .filter(
            GameSession.user_id == user_id
        )
        .order_by(
            GameSession.played_at.desc()
        )
        .limit(limit)
        .all()
    )

    sessions.reverse()

    return sessions


def calculate_accuracy_change(
    current_accuracy: float,
    previous_accuracy: float,
) -> float:
    """
    Calculate change in accuracy between
    consecutive game sessions.
    """

    return round(
        current_accuracy - previous_accuracy,
        2
    )


def build_transformer_sequence(
    db: Session,
    user_id: int,
):
    """
    Build the exact 5-session input required
    by the trained Transformer.

    Returns None if fewer than 5 sessions exist.
    """

    sessions = get_recent_sessions(
        db=db,
        user_id=user_id,
        limit=5,
    )

    if len(sessions) < 5:
        return None

    sequence = []

    previous_accuracy = None

    for session in sessions:

        # ----------------------------------------------------
        # Accuracy change
        # ----------------------------------------------------

        if previous_accuracy is None:

            accuracy_change = (
                session.accuracy_change
                if session.accuracy_change is not None
                else 0.0
            )

        else:

            accuracy_change = (
                session.accuracy_change
                if session.accuracy_change is not None
                else calculate_accuracy_change(
                    session.accuracy,
                    previous_accuracy,
                )
            )

        previous_accuracy = session.accuracy

        # ----------------------------------------------------
        # Transformer input
        # ----------------------------------------------------

        sequence.append({

            "accuracy": float(
                session.accuracy
            ),

            "score": float(
                session.score
            ),

            "response_time": float(
                session.response_time
            ),

            "mistakes": int(
                session.mistakes
            ),

            "accuracy_change": float(
                accuracy_change
            ),

            "game_type": session.game_name,

            "difficulty": session.difficulty,

        })

    return sequence


def calculate_emotional_summary(
    db: Session,
    user_id: int,
):
    """
    Calculate recent self-reported emotional
    engagement indicators.

    These are NOT medical measurements.
    """

    sessions = get_recent_sessions(
        db=db,
        user_id=user_id,
        limit=5,
    )

    valence_values = [
        session.valence
        for session in sessions
        if session.valence is not None
    ]

    arousal_values = [
        session.arousal
        for session in sessions
        if session.arousal is not None
    ]

    average_valence = (
        sum(valence_values) / len(valence_values)
        if valence_values
        else None
    )

    average_arousal = (
        sum(arousal_values) / len(arousal_values)
        if arousal_values
        else None
    )

    return {

        "average_valence": (
            round(average_valence, 2)
            if average_valence is not None
            else None
        ),

        "average_arousal": (
            round(average_arousal, 2)
            if average_arousal is not None
            else None
        ),

        "sessions_with_emotional_data": max(
            len(valence_values),
            len(arousal_values),
        ),

        "note": (
            "Valence and arousal are self-reported "
            "non-medical emotional engagement indicators."
        ),
    }
