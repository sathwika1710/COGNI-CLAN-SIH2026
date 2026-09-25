import torch
import torch.nn.functional as F


FEATURE_NAMES = [
    "accuracy",
    "score",
    "response_time",
    "mistakes",
    "accuracy_change",
]


FEATURE_LABELS = {
    "accuracy": "Accuracy",
    "score": "Score",
    "response_time": "Response time",
    "mistakes": "Mistakes",
    "accuracy_change": "Accuracy trend",
}


class CogniCareExplainer:

    def __init__(self, model):
        self.model = model
        self.model.eval()

    def explain(
        self,
        numerical,
        game_ids,
        difficulty_ids,
    ):
        """
        Perturbation-based explanation for the
        Transformer prediction.

        This is an explanation layer, not a second
        machine-learning model.
        """

        self.model.eval()

        with torch.no_grad():

            original_logits = self.model(
                numerical,
                game_ids,
                difficulty_ids,
            )

            original_probabilities = F.softmax(
                original_logits,
                dim=1,
            )

            predicted_class = torch.argmax(
                original_probabilities,
                dim=1,
            ).item()

            original_probability = (
                original_probabilities[
                    0,
                    predicted_class
                ].item()
            )

        importance = {}

        for feature_index, feature_name in enumerate(
            FEATURE_NAMES
        ):

            perturbed = numerical.clone()

            # Remove the selected feature contribution
            perturbed[:, :, feature_index] = 0.0

            with torch.no_grad():

                perturbed_logits = self.model(
                    perturbed,
                    game_ids,
                    difficulty_ids,
                )

                perturbed_probabilities = F.softmax(
                    perturbed_logits,
                    dim=1,
                )

                perturbed_probability = (
                    perturbed_probabilities[
                        0,
                        predicted_class
                    ].item()
                )

            contribution = (
                original_probability
                - perturbed_probability
            )

            importance[feature_name] = round(
                contribution,
                4,
            )

        sorted_importance = sorted(
            importance.items(),
            key=lambda item: abs(item[1]),
            reverse=True,
        )

        # ----------------------------------------------------
        # Human-readable explanation
        # ----------------------------------------------------

        positive_factors = [
            item
            for item in sorted_importance
            if item[1] > 0
        ]

        negative_factors = [
            item
            for item in sorted_importance
            if item[1] < 0
        ]

        explanation_points = []

        for feature_name, contribution in positive_factors[:3]:

            explanation_points.append({
                "feature": FEATURE_LABELS[feature_name],
                "impact": "supporting",
                "value": contribution,
            })

        for feature_name, contribution in negative_factors[:2]:

            explanation_points.append({
                "feature": FEATURE_LABELS[feature_name],
                "impact": "reducing",
                "value": contribution,
            })

        return {
            "predicted_class": predicted_class,

            "prediction_probability": round(
                original_probability,
                4,
            ),

            "feature_importance": dict(
                sorted_importance
            ),

            "top_factors": explanation_points,

            "method": (
                "Perturbation-based feature sensitivity"
            ),

            "note": (
                "XAI explanations describe model sensitivity "
                "to performance features and are not clinical "
                "interpretations."
            ),
        }
