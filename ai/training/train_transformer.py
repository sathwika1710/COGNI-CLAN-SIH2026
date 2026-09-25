import os
import json
import random

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)

from ai.preprocessing.preprocess import (
    load_data,
    normalize_features,
    encode_categories,
    create_sequences,
)


# ============================================================
# CONFIGURATION
# ============================================================

SEQUENCE_LENGTH = 5

NUMERIC_FEATURES = 5
NUM_GAME_TYPES = 5
NUM_DIFFICULTIES = 3
NUM_CLASSES = 3

EMBEDDING_DIM = 32
NUM_HEADS = 4
NUM_LAYERS = 2
DROPOUT = 0.10

BATCH_SIZE = 32
EPOCHS = 30
LEARNING_RATE = 0.001

MODEL_DIR = "ai/models/cognicare_transformer"
MODEL_PATH = os.path.join(MODEL_DIR, "model.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "model_config.json")

LABEL_NAMES = {
    0: "Easy",
    1: "Medium",
    2: "Hard",
}


# ============================================================
# REPRODUCIBILITY
# ============================================================

SEED = 42

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)


# ============================================================
# TRANSFORMER MODEL
# ============================================================

class CogniCareTransformer(nn.Module):

    def __init__(
        self,
        numeric_features=NUMERIC_FEATURES,
        num_game_types=NUM_GAME_TYPES,
        num_difficulties=NUM_DIFFICULTIES,
        embedding_dim=EMBEDDING_DIM,
        num_heads=NUM_HEADS,
        num_layers=NUM_LAYERS,
        dropout=DROPOUT,
        num_classes=NUM_CLASSES,
    ):
        super().__init__()

        # ----------------------------------------------------
        # Numerical feature projection
        # ----------------------------------------------------

        self.numeric_projection = nn.Linear(
            numeric_features,
            embedding_dim
        )

        # ----------------------------------------------------
        # Game type embedding
        # ----------------------------------------------------

        self.game_embedding = nn.Embedding(
            num_game_types,
            embedding_dim
        )

        # ----------------------------------------------------
        # Difficulty embedding
        # ----------------------------------------------------

        self.difficulty_embedding = nn.Embedding(
            num_difficulties,
            embedding_dim
        )

        # ----------------------------------------------------
        # Position embedding
        # ----------------------------------------------------

        self.position_embedding = nn.Embedding(
            SEQUENCE_LENGTH,
            embedding_dim
        )

        # ----------------------------------------------------
        # Transformer Encoder
        # ----------------------------------------------------

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=embedding_dim,
            nhead=num_heads,
            dim_feedforward=64,
            dropout=dropout,
            batch_first=True,
            activation="gelu",
        )

        self.transformer = nn.TransformerEncoder(
            encoder_layer,
            num_layers=num_layers,
        )

        # ----------------------------------------------------
        # Classification head
        # ----------------------------------------------------

        self.classifier = nn.Sequential(
            nn.LayerNorm(embedding_dim),

            nn.Linear(
                embedding_dim,
                embedding_dim
            ),

            nn.GELU(),

            nn.Dropout(dropout),

            nn.Linear(
                embedding_dim,
                num_classes
            ),
        )

    def forward(
        self,
        numerical,
        game_ids,
        difficulty_ids,
    ):

        batch_size = numerical.size(0)

        # Numerical features
        x_numeric = self.numeric_projection(numerical)

        # Game type
        x_game = self.game_embedding(game_ids)

        # Difficulty
        x_difficulty = self.difficulty_embedding(
            difficulty_ids
        )

        # Position
        positions = torch.arange(
            SEQUENCE_LENGTH,
            device=numerical.device
        )

        positions = positions.unsqueeze(0).expand(
            batch_size,
            SEQUENCE_LENGTH
        )

        x_position = self.position_embedding(
            positions
        )

        # Combine all information
        x = (
            x_numeric
            + x_game
            + x_difficulty
            + x_position
        )

        # Transformer
        x = self.transformer(x)

        # Use the latest session representation
        x = x[:, -1, :]

        # Classification
        output = self.classifier(x)

        return output


# ============================================================
# DATASET
# ============================================================

class CognitiveSequenceDataset(Dataset):

    def __init__(self, sequences, labels):

        self.sequences = sequences
        self.labels = labels

    def __len__(self):

        return len(self.labels)

    def __getitem__(self, index):

        sequence = self.sequences[index]

        numerical = torch.tensor(
            sequence["numerical"],
            dtype=torch.float32
        )

        game_ids = torch.tensor(
            sequence["game_ids"],
            dtype=torch.long
        )

        difficulty_ids = torch.tensor(
            sequence["difficulty_ids"],
            dtype=torch.long
        )

        label = torch.tensor(
            self.labels[index],
            dtype=torch.long
        )

        return (
            numerical,
            game_ids,
            difficulty_ids,
            label,
        )


# ============================================================
# EVALUATION FUNCTION
# ============================================================

def evaluate_model(
    model,
    dataloader,
    criterion,
    device,
):

    model.eval()

    total_loss = 0.0

    all_labels = []
    all_predictions = []

    with torch.no_grad():

        for (
            numerical,
            game_ids,
            difficulty_ids,
            labels,
        ) in dataloader:

            numerical = numerical.to(device)
            game_ids = game_ids.to(device)
            difficulty_ids = difficulty_ids.to(device)
            labels = labels.to(device)

            outputs = model(
                numerical,
                game_ids,
                difficulty_ids,
            )

            loss = criterion(
                outputs,
                labels
            )

            total_loss += loss.item()

            predictions = torch.argmax(
                outputs,
                dim=1
            )

            all_labels.extend(
                labels.cpu().numpy()
            )

            all_predictions.extend(
                predictions.cpu().numpy()
            )

    average_loss = (
        total_loss / len(dataloader)
    )

    accuracy = accuracy_score(
        all_labels,
        all_predictions
    )

    precision = precision_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        all_labels,
        all_predictions,
        average="weighted",
        zero_division=0
    )

    return (
        average_loss,
        accuracy,
        precision,
        recall,
        f1,
        all_labels,
        all_predictions,
    )


# ============================================================
# MAIN TRAINING FUNCTION
# ============================================================

def main():

    print("=" * 70)
    print("CogniCare - Transformer Training")
    print("=" * 70)

    # --------------------------------------------------------
    # Device
    # --------------------------------------------------------

    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    print(f"\nDevice: {device}")

    # --------------------------------------------------------
    # Load dataset
    # --------------------------------------------------------

    print("\nLoading dataset...")

    df = load_data()

    # --------------------------------------------------------
    # Preprocessing
    # --------------------------------------------------------

    print("\nNormalizing features...")

    df = normalize_features(df)

    print("Encoding categorical features...")

    df = encode_categories(df)

    print("Creating longitudinal sequences...")

    sequences, labels = create_sequences(df)

    print(
        f"Total sequences: {len(sequences)}"
    )

    print(
        f"Sequence length: {SEQUENCE_LENGTH}"
    )

    # --------------------------------------------------------
    # Train/Test split
    # --------------------------------------------------------

    indices = np.arange(
        len(sequences)
    )

    train_indices, test_indices = train_test_split(
        indices,
        test_size=0.20,
        random_state=SEED,
        stratify=labels,
    )

    # --------------------------------------------------------
    # Train/Validation split
    # --------------------------------------------------------

    train_indices, val_indices = train_test_split(
        train_indices,
        test_size=0.20,
        random_state=SEED,
        stratify=labels[train_indices],
    )

    train_sequences = [
        sequences[i]
        for i in train_indices
    ]

    val_sequences = [
        sequences[i]
        for i in val_indices
    ]

    test_sequences = [
        sequences[i]
        for i in test_indices
    ]

    train_labels = labels[train_indices]
    val_labels = labels[val_indices]
    test_labels = labels[test_indices]

    print("\nDataset split:")
    print(
        f"Training   : {len(train_sequences)} sequences"
    )
    print(
        f"Validation : {len(val_sequences)} sequences"
    )
    print(
        f"Testing    : {len(test_sequences)} sequences"
    )

    # --------------------------------------------------------
    # Create datasets
    # --------------------------------------------------------

    train_dataset = CognitiveSequenceDataset(
        train_sequences,
        train_labels
    )

    val_dataset = CognitiveSequenceDataset(
        val_sequences,
        val_labels
    )

    test_dataset = CognitiveSequenceDataset(
        test_sequences,
        test_labels
    )

    # --------------------------------------------------------
    # Create dataloaders
    # --------------------------------------------------------

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
    )

    # --------------------------------------------------------
    # Create Transformer
    # --------------------------------------------------------

    print("\nCreating Transformer model...")

    model = CogniCareTransformer().to(device)

    print(model)

    # --------------------------------------------------------
    # Class weights
    # --------------------------------------------------------

    class_counts = np.bincount(
        train_labels,
        minlength=NUM_CLASSES
    )

    class_weights = (
        len(train_labels)
        / (
            NUM_CLASSES
            * class_counts
        )
    )

    class_weights = torch.tensor(
        class_weights,
        dtype=torch.float32
    ).to(device)

    print("\nClass distribution:")

    for class_id in range(NUM_CLASSES):

        print(
            f"{LABEL_NAMES[class_id]}: "
            f"{class_counts[class_id]}"
        )

    # --------------------------------------------------------
    # Loss function
    # --------------------------------------------------------

    criterion = nn.CrossEntropyLoss(
        weight=class_weights
    )

    # --------------------------------------------------------
    # Optimizer
    # --------------------------------------------------------

    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=0.01,
    )

    # --------------------------------------------------------
    # Training
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("Starting Transformer Training")
    print("=" * 70)

    best_val_f1 = -1.0

    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    for epoch in range(1, EPOCHS + 1):

        model.train()

        total_train_loss = 0.0

        for (
            numerical,
            game_ids,
            difficulty_ids,
            labels_batch,
        ) in train_loader:

            numerical = numerical.to(device)
            game_ids = game_ids.to(device)
            difficulty_ids = difficulty_ids.to(device)
            labels_batch = labels_batch.to(device)

            # Clear gradients
            optimizer.zero_grad()

            # Forward pass
            outputs = model(
                numerical,
                game_ids,
                difficulty_ids,
            )

            # Calculate loss
            loss = criterion(
                outputs,
                labels_batch
            )

            # Backpropagation
            loss.backward()

            # Gradient clipping
            torch.nn.utils.clip_grad_norm_(
                model.parameters(),
                max_norm=1.0
            )

            # Update weights
            optimizer.step()

            total_train_loss += loss.item()

        average_train_loss = (
            total_train_loss
            / len(train_loader)
        )

        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        (
            val_loss,
            val_accuracy,
            val_precision,
            val_recall,
            val_f1,
            _,
            _,
        ) = evaluate_model(
            model,
            val_loader,
            criterion,
            device,
        )

        print(
            f"Epoch {epoch:02d}/{EPOCHS} | "
            f"Train Loss: {average_train_loss:.4f} | "
            f"Val Loss: {val_loss:.4f} | "
            f"Val Accuracy: {val_accuracy:.4f} | "
            f"Val F1: {val_f1:.4f}"
        )

        # ----------------------------------------------------
        # Save best model
        # ----------------------------------------------------

        if val_f1 > best_val_f1:

            best_val_f1 = val_f1

            torch.save(
                model.state_dict(),
                MODEL_PATH
            )

            print(
                f"  -> Best model saved "
                f"(Validation F1: {val_f1:.4f})"
            )

    # ========================================================
    # TESTING
    # ========================================================

    print("\n")
    print("=" * 70)
    print("Evaluating Best Transformer Model")
    print("=" * 70)

    # Load best model
    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location=device,
            weights_only=True,
        )
    )

    (
        test_loss,
        test_accuracy,
        test_precision,
        test_recall,
        test_f1,
        test_labels_actual,
        test_predictions,
    ) = evaluate_model(
        model,
        test_loader,
        criterion,
        device,
    )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    print("\nTEST RESULTS")
    print("-" * 50)

    print(
        f"Test Loss      : {test_loss:.4f}"
    )

    print(
        f"Accuracy       : {test_accuracy:.4f}"
    )

    print(
        f"Precision      : {test_precision:.4f}"
    )

    print(
        f"Recall         : {test_recall:.4f}"
    )

    print(
        f"F1 Score       : {test_f1:.4f}"
    )

    # --------------------------------------------------------
    # Classification report
    # --------------------------------------------------------

    print("\nClassification Report:")
    print("-" * 50)

    print(
        classification_report(
            test_labels_actual,
            test_predictions,
            labels=[0, 1, 2],
            target_names=[
                "Easy",
                "Medium",
                "Hard",
            ],
            zero_division=0,
        )
    )

    # --------------------------------------------------------
    # Confusion matrix
    # --------------------------------------------------------

    cm = confusion_matrix(
        test_labels_actual,
        test_predictions,
        labels=[0, 1, 2],
    )

    print("Confusion Matrix:")
    print("-" * 50)

    print(cm)

    # ========================================================
    # SAVE MODEL CONFIGURATION
    # ========================================================

    config = {
        "model_name": "CogniCare Transformer",

        "architecture": {
            "type": "Transformer Encoder",
            "embedding_dim": EMBEDDING_DIM,
            "num_heads": NUM_HEADS,
            "num_layers": NUM_LAYERS,
            "dropout": DROPOUT,
            "sequence_length": SEQUENCE_LENGTH,
        },

        "input_features": [
            "accuracy",
            "score",
            "response_time",
            "mistakes",
            "accuracy_change",
            "game_type",
            "difficulty",
        ],

        "target": "recommended_difficulty",

        "classes": {
            "0": "Easy",
            "1": "Medium",
            "2": "Hard",
        },

        "training": {
            "batch_size": BATCH_SIZE,
            "epochs": EPOCHS,
            "learning_rate": LEARNING_RATE,
            "optimizer": "AdamW",
            "loss": "Weighted Cross Entropy",
            "random_seed": SEED,
        },

        "dataset": {
            "type": "Synthetic prototype dataset",
            "total_sequences": len(sequences),
            "training_sequences": len(train_sequences),
            "validation_sequences": len(val_sequences),
            "testing_sequences": len(test_sequences),
        },

        "test_metrics": {
            "loss": float(test_loss),
            "accuracy": float(test_accuracy),
            "precision": float(test_precision),
            "recall": float(test_recall),
            "f1_score": float(test_f1),
        },

        "confusion_matrix": cm.tolist(),
    }

    with open(
        CONFIG_PATH,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            config,
            file,
            indent=4
        )

    # ========================================================
    # FINAL MESSAGE
    # ========================================================

    print("\n")
    print("=" * 70)
    print("TRAINING COMPLETED SUCCESSFULLY")
    print("=" * 70)

    print(
        f"\nModel saved to:"
        f"\n{MODEL_PATH}"
    )

    print(
        f"\nConfiguration saved to:"
        f"\n{CONFIG_PATH}"
    )

    print(
        "\nTransformer is ready for inference."
    )

    print(
        "\nNext step:"
        "\nConnect the trained Transformer to PostgreSQL"
        "\nand the /adaptive/{user_id}/{game_name} API."
    )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()