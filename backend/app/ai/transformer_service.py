import os
import sys

import torch


# ============================================================
# PROJECT ROOT
# ============================================================

PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../..",
    )
)

if PROJECT_ROOT not in sys.path:

    sys.path.insert(
        0,
        PROJECT_ROOT,
    )


from ai.inference.predict import TransformerPredictor
from ai.training.train_transformer import CogniCareTransformer
from ai.explainability.explainer import CogniCareExplainer


MODEL_PATH = "ai/models/cognicare_transformer/model.pt"


# ============================================================
# SINGLE MODEL INSTANCES
# ============================================================

_predictor = None
_explainer = None


def get_predictor():

    global _predictor

    if _predictor is None:

        _predictor = TransformerPredictor()

    return _predictor


def get_explainer():

    global _explainer

    if _explainer is None:

        model = CogniCareTransformer()

        state_dict = torch.load(
            MODEL_PATH,
            map_location="cpu",
            weights_only=True,
        )

        model.load_state_dict(
            state_dict
        )

        model.eval()

        _explainer = CogniCareExplainer(
            model
        )

    return _explainer


# ============================================================
# DIFFICULTY PREDICTION
# ============================================================

def predict_difficulty(
    sessions,
):

    predictor = get_predictor()

    return predictor.predict(
        sessions
    )


# ============================================================
# PREPARE TENSORS FOR XAI
# ============================================================

def prepare_xai_inputs(
    sessions,
):

    numerical_features = []
    game_ids = []
    difficulty_ids = []

    game_types = {
        "Memory Match & Recall": 0,
        "Everyday Problem Solver": 1,
        "Story & Conversation": 2,
        "My Life Memories": 3,
        "Behaviour & Emotional Response": 4,
    }

    difficulties = {
        "Easy": 0,
        "Medium": 1,
        "Hard": 2,
    }

    for session in sessions:

        numerical_features.append([
            float(session["accuracy"]) / 100.0,
            float(session["score"]) / 10.0,
            float(session["response_time"]) / 12.0,
            float(session["mistakes"]) / 10.0,
            float(session["accuracy_change"]) / 100.0,
        ])

        game_ids.append(
            game_types.get(
                session["game_type"],
                0,
            )
        )

        difficulty_ids.append(
            difficulties.get(
                session["difficulty"],
                0,
            )
        )

    numerical = torch.tensor(
        [numerical_features],
        dtype=torch.float32,
    )

    game_tensor = torch.tensor(
        [game_ids],
        dtype=torch.long,
    )

    difficulty_tensor = torch.tensor(
        [difficulty_ids],
        dtype=torch.long,
    )

    return (
        numerical,
        game_tensor,
        difficulty_tensor,
    )


# ============================================================
# XAI EXPLANATION
# ============================================================

def explain_prediction(
    sessions,
):

    explainer = get_explainer()

    (
        numerical,
        game_ids,
        difficulty_ids,
    ) = prepare_xai_inputs(
        sessions
    )

    return explainer.explain(
        numerical,
        game_ids,
        difficulty_ids,
    )
