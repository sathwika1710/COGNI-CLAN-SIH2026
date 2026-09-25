"""
=========================================================
CogniCare - Clerk Authentication
=========================================================

FastAPI authentication dependency for Clerk.

The frontend authenticates the user with Clerk.

The backend verifies the Clerk session token.

IMPORTANT:
Never trust a user_id sent directly by the browser
for authorization.
=========================================================
"""


import os

from typing import Annotated

from dotenv import load_dotenv

from fastapi import (
    Depends,
    HTTPException,
    Request,
)

from clerk_backend_api import (
    AuthenticateRequestOptions,
    authenticate_request,
)


# ======================================================
# Load environment variables
# ======================================================

load_dotenv()


# ======================================================
# Configuration
# ======================================================

CLERK_SECRET_KEY = os.getenv(
    "CLERK_SECRET_KEY"
)

CLERK_JWT_KEY = os.getenv(
    "CLERK_JWT_KEY"
)

CLERK_AUTHORIZED_PARTY = os.getenv(
    "CLERK_AUTHORIZED_PARTY",
    "http://localhost:5500"
)


# ======================================================
# Validate configuration
# ======================================================

if not CLERK_SECRET_KEY:

    print(
        "WARNING: CLERK_SECRET_KEY is not configured."
    )


# ======================================================
# Authentication dependency
# ======================================================

def require_auth(
    request: Request,
):
    """
    Verify that the incoming request contains
    a valid authenticated Clerk session.
    """

    try:

        state = authenticate_request(

            request,

            AuthenticateRequestOptions(

                secret_key=CLERK_SECRET_KEY,

                jwt_key=CLERK_JWT_KEY,

                authorized_parties=[
                    CLERK_AUTHORIZED_PARTY
                ],

                accepts_token=[
                    "session_token"
                ],

            ),

        )


        # ------------------------------------------------
        # Check authentication state
        # ------------------------------------------------

        if not state.is_signed_in:

            raise HTTPException(

                status_code=401,

                detail=(
                    state.reason.name
                    if state.reason
                    else "User is not authenticated."
                ),

                headers={
                    "WWW-Authenticate": "Bearer"
                },

            )


        # ------------------------------------------------
        # Get authenticated Clerk user ID
        # ------------------------------------------------

        user_id = None


        if state.payload:

            user_id = state.payload.get(
                "sub"
            )


        if not user_id:

            raise HTTPException(

                status_code=401,

                detail="Authenticated user ID not found."

            )


        # ------------------------------------------------
        # Return authenticated user information
        # ------------------------------------------------

        return {

            "clerk_user_id": user_id,

            "session_id":
                state.payload.get("sid"),

            "payload":
                state.payload,

        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "Clerk authentication error:",
            error
        )


        raise HTTPException(

            status_code=401,

            detail="Invalid or expired authentication."

        )


# ======================================================
# FastAPI dependency type
# ======================================================

CurrentUser = Annotated[
    dict,
    Depends(require_auth)
]