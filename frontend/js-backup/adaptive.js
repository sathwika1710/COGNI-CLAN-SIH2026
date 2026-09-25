const DIFFICULTY_SETTINGS = {
    Easy: {
        objects: 3,
        displayTime: 5
    },

    Medium: {
        objects: 4,
        displayTime: 4
    },

    Hard: {
        objects: 5,
        displayTime: 3
    }
};

async function getAdaptiveDifficulty(userId, gameName) {
    try {
        const encodedGameName = encodeURIComponent(gameName);

        const result = await apiGet(
            `/adaptive/${userId}/${encodedGameName}`
        );

        return result;

    } catch (error) {
        console.error("Adaptive difficulty error:", error);

        // Safe fallback for demo/offline situation
        return {
            user_id: userId,
            game_name: gameName,
            recommended_difficulty: "Easy",
            confidence: 0,
            probabilities: {
                Easy: 1,
                Medium: 0,
                Hard: 0
            },
            reason: "Adaptive service unavailable. Using Easy difficulty."
        };
    }
}

function getDifficultySettings(difficulty) {
    return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.Easy;
}
