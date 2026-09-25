import pandas as pd
import numpy as np

DATA_PATH = "data/synthetic/training_data.csv"
SEQUENCE_LENGTH = 5

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

TARGET_LABELS = {
    "Easy": 0,
    "Medium": 1,
    "Hard": 2,
}


def load_data():
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded dataset: {df.shape}")
    return df


def normalize_features(df):
    df = df.copy()

    df["accuracy"] = df["accuracy"] / 100.0
    df["score"] = df["score"] / 10.0
    df["response_time"] = df["response_time"] / 12.0
    df["mistakes"] = df["mistakes"] / 10.0
    df["accuracy_change"] = df["accuracy_change"] / 100.0

    return df


def encode_categories(df):
    df = df.copy()

    df["game_type_id"] = (
        df["game_type"]
        .map(GAME_TYPES)
        .fillna(0)
        .astype(int)
    )

    df["difficulty_id"] = (
        df["difficulty"]
        .map(DIFFICULTIES)
        .fillna(0)
        .astype(int)
    )

    df["target_id"] = (
        df["target_difficulty"]
        .map(TARGET_LABELS)
        .astype(int)
    )

    return df


def create_sequences(df):
    sequences = []
    labels = []

    feature_columns = [
        "accuracy",
        "score",
        "response_time",
        "mistakes",
        "accuracy_change",
    ]

    for sequence_id, group in df.groupby("sequence_id"):

        group = group.sort_values("session_number")

        if len(group) != SEQUENCE_LENGTH:
            continue

        numerical_features = (
            group[feature_columns]
            .values
            .astype(np.float32)
        )

        game_ids = (
            group["game_type_id"]
            .values
            .astype(np.int64)
        )

        difficulty_ids = (
            group["difficulty_id"]
            .values
            .astype(np.int64)
        )

        target = int(group["target_id"].iloc[0])

        sequences.append({
            "numerical": numerical_features,
            "game_ids": game_ids,
            "difficulty_ids": difficulty_ids,
        })

        labels.append(target)

    print(f"Created sequences: {len(sequences)}")

    return sequences, np.array(labels, dtype=np.int64)


if __name__ == "__main__":

    print("=" * 60)
    print("CogniCare Transformer Preprocessing")
    print("=" * 60)

    df = load_data()

    df = normalize_features(df)

    df = encode_categories(df)

    sequences, labels = create_sequences(df)

    print("\nExample sequence:")
    print(sequences[0]["numerical"])

    print("\nGame IDs:")
    print(sequences[0]["game_ids"])

    print("\nDifficulty IDs:")
    print(sequences[0]["difficulty_ids"])

    print("\nExample target:")
    print(labels[0])

    print("\nPreprocessing completed successfully!")