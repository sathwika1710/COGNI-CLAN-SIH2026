from datetime import datetime
from typing import Optional

from pydantic import BaseModel

# ============================================================
# AUTHENTICATION
# ============================================================

class SignupRequest(BaseModel):

    name: str
    email: str
    password: str
    age: int
    preferred_language: str = "en"


class LoginRequest(BaseModel):

    email: str
    password: str


class AuthResponse(BaseModel):

    message: str
    user_id: int
    name: str
    email: str
# ============================================================
# USER
# ============================================================

class UserCreate(BaseModel):

    name: str
    age: int
    preferred_language: str = "en"


class UserResponse(BaseModel):

    id: int
    name: str
    age: int
    preferred_language: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# GAME SESSION
# ============================================================

class GameSessionCreate(BaseModel):

    user_id: int
    game_name: str
    difficulty: str

    accuracy: float
    score: float
    response_time: float
    mistakes: int

    accuracy_change: float = 0.0

    # Emotional engagement
    valence: Optional[float] = None
    arousal: Optional[float] = None

    completed: bool = True


class GameSessionResponse(BaseModel):

    id: int
    user_id: int
    game_name: str
    difficulty: str

    accuracy: float
    score: float
    response_time: float
    mistakes: int
    accuracy_change: float

    valence: Optional[float]
    arousal: Optional[float]

    completed: bool
    played_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# MEMORY
# ============================================================

class MemoryCreate(BaseModel):

    user_id: int
    title: str
    description: Optional[str] = None


class MemoryResponse(BaseModel):

    id: int
    user_id: int
    title: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# REMINDER
# ============================================================

class ReminderCreate(BaseModel):

    user_id: int
    title: str
    reminder_type: str
    reminder_time: str
    notes: Optional[str] = None


class ReminderResponse(BaseModel):

    id: int
    user_id: int
    title: str
    reminder_type: str
    reminder_time: str
    notes: Optional[str]
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# ADAPTIVE DIFFICULTY
# ============================================================

class AdaptiveResponse(BaseModel):

    user_id: int
    game_name: str

    recommended_difficulty: str

    confidence: float

    probabilities: dict

    reason: str

    explanation: Optional[dict] = None