from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from pwdlib import PasswordHash

from ..database import get_db
from ..models import User
from ..schemas import (
    SignupRequest,
    LoginRequest,
    AuthResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


password_hash = PasswordHash.recommended()


# ============================================================
# SIGN UP
# ============================================================

@router.post(
    "/signup",
    response_model=AuthResponse,
)
def signup(
    signup_data: SignupRequest,
    db: Session = Depends(get_db),
):

    email = signup_data.email.strip().lower()

    # Check existing account
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:

        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists.",
        )

    # Basic validation
    if len(signup_data.password) < 8:

        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters.",
        )

    if signup_data.age < 1 or signup_data.age > 120:

        raise HTTPException(
            status_code=400,
            detail="Please enter a valid age.",
        )

    # Hash password
    hashed_password = password_hash.hash(
        signup_data.password
    )

    # Create user
    user = User(
        name=signup_data.name.strip(),
        email=email,
        password_hash=hashed_password,
        age=signup_data.age,
        preferred_language=signup_data.preferred_language,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(
        message="Account created successfully.",
        user_id=user.id,
        name=user.name,
        email=user.email,
    )


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=AuthResponse,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):

    email = login_data.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # Account created before authentication was added
    if not user.password_hash:

        raise HTTPException(
            status_code=401,
            detail="This account needs to be registered again.",
        )

    # Verify password
    if not password_hash.verify(
        login_data.password,
        user.password_hash,
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    return AuthResponse(
        message="Login successful.",
        user_id=user.id,
        name=user.name,
        email=user.email,
    )