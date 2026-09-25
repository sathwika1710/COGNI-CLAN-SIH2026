import os
import sys
import json
from pathlib import Path
import numpy as np
import torch
import torch.nn.functional as F


# Allow importing the Transformer model
PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../.."
    )
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


from ai.training.train_transformer import CogniCareTransformer


MODEL_PATH = "ai/models/cognicare_transformer/model.pt"

PROJECT_ROOT = Path(__file__).resolve().parents[2]

CONFIG_PATH = PROJECT_ROOT / "models" / "cognicare_transformer" / "model_config.json"


LABEL_NAMES = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
}


GAME_TYPES = {
    "Memory Match & Recall": 0,
    "Everyday Problem Solver": 1,
    "Story & Conversation": 2,
    "My Life Memories": 3,
    "Behaviour & Emotional Response": 4,
}


DIFFICULTIES = {
    "Easy": 0,
    "Medium": 1,
    "Hard": 2,
}


class TransformerPredictor:

    def __init__(self):

        self.device = torch.device("cpu")

        # ----------------------------------------------------
        # Load configuration
        # ----------------------------------------------------

        with open(
            CONFIG_PATH,
            "r",
            encoding="utf-8"
        ) as file:

            self.config = json.load(file)

        # ----------------------------------------------------
        # Create model
        # ----------------------------------------------------

        self.model = CogniCareTransformer()

        # ----------------------------------------------------
        # Load trained weights
        # ----------------------------------------------------

        state_dict = torch.load(
            MODEL_PATH,
            map_location=self.device,
            weights_only=True,
        )

        self.model.load_state_dict(state_dict)

        self.model.to(self.device)

        self.model.eval()

        print("Transformer model loaded successfully.")

    def predict(self, sessions):

        """
        Predict recommended difficulty from
        the user's latest 5 game sessions.

        Each session must contain:

        accuracy
        score
        response_time
        mistakes
        accuracy_change
        game_type
        difficulty
        """

        if len(sessions) != 5:

            raise ValueError(
                "Transformer requires exactly 5 sessions."
            )

        numerical_features = []
        game_ids = []
        difficulty_ids = []

        for session in sessions:

            accuracy = float(
                session["accuracy"]
            ) / 100.0

            score = float(
                session["score"]
            ) / 10.0

            response_time = float(
                session["response_time"]
            ) / 12.0

            mistakes = float(
                session["mistakes"]
            ) / 10.0

            accuracy_change = float(
                session["accuracy_change"]
            ) / 100.0

            numerical_features.append([
                accuracy,
                score,
                response_time,
                mistakes,
                accuracy_change,
            ])

            game_type = session["game_type"]

            difficulty = session["difficulty"]

            game_ids.append(
                GAME_TYPES.get(
                    game_type,
                    0
                )
            )

            difficulty_ids.append(
                DIFFICULTIES.get(
                    difficulty,
                    0
                )
            )

        # ----------------------------------------------------
        # Convert to tensors
        # ----------------------------------------------------

        numerical = torch.tensor(
            [numerical_features],
            dtype=torch.float32,
            device=self.device,
        )

        game_tensor = torch.tensor(
            [game_ids],
            dtype=torch.long,
            device=self.device,
        )

        difficulty_tensor = torch.tensor(
            [difficulty_ids],
            dtype=torch.long,
            device=self.device,
        )

        # ----------------------------------------------------
        # Model prediction
        # ----------------------------------------------------

        with torch.no_grad():

            logits = self.model(
                numerical,
                game_tensor,
                difficulty_tensor,
            )

            probabilities = F.softmax(
                logits,
                dim=1
            )

            predicted_class = torch.argmax(
                probabilities,
                dim=1
            ).item()

            confidence = probabilities[
                0,
                predicted_class
            ].item()

        # ----------------------------------------------------
        # Result
        # ----------------------------------------------------

        recommended_difficulty = LABEL_NAMES[
            predicted_class
        ]

        probability_map = {
            LABEL_NAMES[i]: round(
                probabilities[0, i].item(),
                4
            )
            for i in range(3)
        }

        return {
            "recommended_difficulty":
                recommended_difficulty,

            "confidence":
                round(confidence, 4),

            "probabilities":
                probability_map,

            "reason":
                (
                    "The Transformer predicts the "
                    "recommended difficulty from "
                    "the user's recent longitudinal "
                    "game-performance sequence."
                ),
        }


# ------------------------------------------------------------
# Simple test
# ------------------------------------------------------------

if __name__ == "__main__":

    predictor = TransformerPredictor()

    test_sessions = [

        {
            "accuracy": 75,
            "score": 6,
            "response_time": 5,
            "mistakes": 2,
            "accuracy_change": 0,
            "game_type": "Memory Match & Recall",
            "difficulty": "Easy",
        },

        {
            "accuracy": 82,
            "score": 7,
            "response_time": 4.5,
            "mistakes": 1,
            "accuracy_change": 7,
            "game_type": "Everyday Problem Solver",
            "difficulty": "Easy",
        },

        {
            "accuracy": 80,
            "score": 7,
            "response_time": 4.8,
            "mistakes": 2,
            "accuracy_change": -2,
            "game_type": "Story & Conversation",
            "difficulty": "Easy",
        },

        {
            "accuracy": 88,
            "score": 8,
            "response_time": 4,
            "mistakes": 1,
            "accuracy_change": 8,
            "game_type": "Memory Match & Recall",
            "difficulty": "Easy",
        },

        {
            "accuracy": 91,
            "score": 9,
            "response_time": 3.5,
            "mistakes": 0,
            "accuracy_change": 3,
            "game_type": "Everyday Problem Solver",
            "difficulty": "Medium",
        },
    ]

    result = predictor.predict(
        test_sessions
    )

    print("\nPrediction:")
    print(
        json.dumps(
            result,
            indent=4
        )
    )