from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
)

from sqlalchemy.dialects.postgresql import JSONB

from .database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=True,
        unique=True,
        index=True,
    )

    password_hash = Column(
        String(255),
        nullable=True,
    )

    age = Column(
        Integer,
        nullable=False,
    )

    preferred_language = Column(
        String(20),
        default="en",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class GameSession(Base):

    __tablename__ = "game_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    game_name = Column(
        String(100),
        nullable=False,
    )

    difficulty = Column(
        String(20),
        nullable=False,
    )

    accuracy = Column(
        Float,
        nullable=False,
    )

    score = Column(
        Float,
        nullable=False,
    )

    response_time = Column(
        Float,
        nullable=False,
    )

    mistakes = Column(
        Integer,
        nullable=False,
    )

    accuracy_change = Column(
        Float,
        default=0.0,
    )

    # --------------------------------------------------------
    # Emotional engagement indicators
    # --------------------------------------------------------

    valence = Column(
        Float,
        nullable=True,
    )

    arousal = Column(
        Float,
        nullable=True,
    )

    completed = Column(
        Boolean,
        default=True,
    )

    played_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )


class Memory(Base):

    __tablename__ = "memories"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Reminder(Base):

    __tablename__ = "reminders"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    title = Column(
        String(200),
        nullable=False,
    )

    reminder_type = Column(
        String(50),
        nullable=False,
    )

    reminder_time = Column(
        String(20),
        nullable=False,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    completed = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
class CognitiveScreening(Base):
    
    __tablename__ = "cognitive_screenings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    score = Column(
        Integer,
        nullable=False,
    )

    max_score = Column(
        Integer,
        nullable=False,
    )

    percentage = Column(
        Integer,
        nullable=False,
    )

    result_category = Column(
        String(100),
        nullable=False,
    )

    answers = Column(
        JSONB,
        nullable=False,
    )

    screened_at = Column(
        DateTime,
        default=datetime.utcnow,
        index=True,
    )