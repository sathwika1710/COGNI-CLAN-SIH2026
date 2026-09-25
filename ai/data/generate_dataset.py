import os
import random
import numpy as np
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

RANDOM_SEED = 42
NUM_SEQUENCES = 1000
SESSIONS_PER_SEQUENCE = 5

OUTPUT_PATH = "data/synthetic/training_data.csv"

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)


# ============================================================
# GAME TYPES
# ============================================================

GAME_TYPES = [
    "Memory Match & Recall",
    "Everyday Problem Solver",
    "Story & Conversation",
    "My Life Memories",
    "Behaviour & Emotional Response",
]


# ============================================================
# DIFFICULTY VALUES
# ============================================================

DIFFICULTIES = [
    "Easy",
    "Medium",
    "Hard",
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clamp(value, minimum, maximum):
    return max(minimum, min(value, maximum))


def choose_target_difficulty(final_accuracy, accuracy_trend, avg_response_time):
    """
    Generate the synthetic target label.

    This is only for creating prototype training data.
    It is NOT a medical rule and does not represent clinical guidance.
    """

    performance_score = (
        final_accuracy
        + (accuracy_trend * 20)
        - (avg_response_time * 1.5)
    )

    if performance_score < 45:
        return "Easy"

    elif performance_score < 70:
        return "Medium"

    else:
        return "Hard"


# ============================================================
# DATASET GENERATION
# ============================================================

rows = []

for sequence_id in range(1, NUM_SEQUENCES + 1):

    # --------------------------------------------------------
    # Simulated underlying ability
    # --------------------------------------------------------

    ability = np.random.normal(0.60, 0.15)
    ability = clamp(ability, 0.20, 0.95)

    previous_accuracy = None
    sequence_accuracies = []
    sequence_response_times = []

    sequence_rows = []

    for session_number in range(1, SESSIONS_PER_SEQUENCE + 1):

        game_type = random.choice(GAME_TYPES)

        difficulty = random.choices(
            DIFFICULTIES,
            weights=[0.35, 0.45, 0.20],
            k=1
        )[0]

        # Difficulty effect
        difficulty_effect = {
            "Easy": 0.10,
            "Medium": 0.00,
            "Hard": -0.12
        }[difficulty]

        # Small learning/progress effect over sessions
        learning_effect = (session_number - 1) * 0.015

        # Random noise
        noise = np.random.normal(0, 0.06)

        accuracy_probability = (
            ability
            + difficulty_effect
            + learning_effect
            + noise
        )

        accuracy_probability = clamp(
            accuracy_probability,
            0.15,
            0.98
        )

        accuracy = round(
            accuracy_probability * 100,
            2
        )

        # ----------------------------------------------------
        # Response time
        # ----------------------------------------------------

        base_response_time = np.random.normal(5.5, 1.2)

        difficulty_time_effect = {
            "Easy": -0.5,
            "Medium": 0.0,
            "Hard": 0.8
        }[difficulty]

        response_time = (
            base_response_time
            + difficulty_time_effect
            - (accuracy / 100) * 0.8
        )

        response_time = round(
            clamp(response_time, 1.5, 12.0),
            2
        )

        # ----------------------------------------------------
        # Number of questions
        # ----------------------------------------------------

        total_questions = random.choice(
            [5, 6, 8, 10]
        )

        correct_answers = round(
            total_questions * accuracy_probability
        )

        correct_answers = clamp(
            correct_answers,
            0,
            total_questions
        )

        mistakes = total_questions - correct_answers

        score = correct_answers

        # ----------------------------------------------------
        # Accuracy change
        # ----------------------------------------------------

        if previous_accuracy is None:
            accuracy_change = 0.0
        else:
            accuracy_change = round(
                accuracy - previous_accuracy,
                2
            )

        previous_accuracy = accuracy

        sequence_accuracies.append(accuracy)
        sequence_response_times.append(response_time)

        sequence_rows.append({
            "sequence_id": sequence_id,
            "session_number": session_number,
            "game_type": game_type,
            "difficulty": difficulty,
            "accuracy": accuracy,
            "score": score,
            "response_time": response_time,
            "mistakes": mistakes,
            "accuracy_change": accuracy_change,
        })

    # ========================================================
    # TARGET LABEL
    # ========================================================

    final_accuracy = sequence_accuracies[-1]

    accuracy_trend = (
        sequence_accuracies[-1]
        - sequence_accuracies[0]
    ) / 100

    avg_response_time = np.mean(
        sequence_response_times
    )

    target_difficulty = choose_target_difficulty(
        final_accuracy,
        accuracy_trend,
        avg_response_time
    )

    # Add target to every row belonging to this sequence
    for row in sequence_rows:
        row["target_difficulty"] = target_difficulty
        rows.append(row)


# ============================================================
# CREATE DATAFRAME
# ============================================================

df = pd.DataFrame(rows)


# ============================================================
# SAVE DATASET
# ============================================================

os.makedirs(
    os.path.dirname(OUTPUT_PATH),
    exist_ok=True
)

df.to_csv(
    OUTPUT_PATH,
    index=False
)


# ============================================================
# DISPLAY INFORMATION
# ============================================================

print("=" * 60)
print("CogniCare Synthetic Transformer Dataset")
print("=" * 60)

print(f"Output file      : {OUTPUT_PATH}")
print(f"Total rows       : {len(df)}")
print(f"Sequences        : {df['sequence_id'].nunique()}")
print(f"Sessions/sequence: {SESSIONS_PER_SEQUENCE}")

print("\nColumns:")
for column in df.columns:
    print(f"  - {column}")

print("\nTarget distribution:")
print(
    df.groupby("target_difficulty")["sequence_id"]
    .nunique()
)

print("\nFirst 10 rows:")
print(df.head(10).to_string(index=False))

print("\nDataset generation completed successfully!")