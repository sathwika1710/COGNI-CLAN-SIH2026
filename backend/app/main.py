from fastapi import FastAPI
from .database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

from .routes import user_routes
from .routes import game_routes
from .routes import analysis_routes
from .routes import adaptive_routes
from .routes import memory_routes
from .routes import reminder_routes
from .routes import auth_routes
from .routes import screening_routes


# ============================================================
# DATABASE TABLE CREATION
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="CogniCare API",
    description=(
        "AI-based cognitive gaming and memory "
        "assistance platform for elderly users."
    ),
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(user_routes.router)
app.include_router(game_routes.router)
app.include_router(analysis_routes.router)
app.include_router(adaptive_routes.router)
app.include_router(memory_routes.router)
app.include_router(reminder_routes.router)
app.include_router(auth_routes.router)
app.include_router(screening_routes.router)

# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "CogniCare API is running",
        "status": "healthy",
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "CogniCare Backend",
    }
