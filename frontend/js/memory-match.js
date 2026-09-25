const USER_ID = Number(JSON.parse(localStorage.getItem("cognicare_user") || "{}").user_id || 0);
const GAME_NAME = "Memory Match & Recall";

const OBJECTS = [
    { name: "Apple", emoji: "\u{1F34E}" },
    { name: "Flower", emoji: "\u{1F33C}" },
    { name: "House", emoji: "\u{1F3E0}" },
    { name: "Tree", emoji: "\u{1F333}" },
    { name: "Cup", emoji: "\u{2615}" },
    { name: "Book", emoji: "\u{1F4D6}" },
    { name: "Sun", emoji: "\u{2600}\u{FE0F}" },
    { name: "Bell", emoji: "\u{1F514}" },
    { name: "Fish", emoji: "\u{1F41F}" },
    { name: "Car", emoji: "\u{1F697}" }
];

let adaptiveResult = null;
let difficulty = "Easy";
let settings = DIFFICULTY_SETTINGS.Easy;

let selectedObjects = [];
let correctObjects = [];
let startTime = 0;
let gameStarted = false;

document.addEventListener("DOMContentLoaded", async () => {
    await loadAdaptiveDifficulty();

    const startButton = document.getElementById("startGame");

    if (startButton) {
        startButton.addEventListener("click", startGame);
    }
});

async function loadAdaptiveDifficulty() {
    const status = document.getElementById("adaptiveStatus");

    if (status) {
        status.textContent = "AI is analyzing recent performance...";
    }

    adaptiveResult = await getAdaptiveDifficulty(USER_ID, GAME_NAME);

    difficulty = adaptiveResult.recommended_difficulty || "Easy";
    settings = getDifficultySettings(difficulty);

    updateDifficultyUI();

    if (status) {
        status.textContent =
            `AI recommendation: ${difficulty} difficulty`;
    }
}

function updateDifficultyUI() {
    const difficultyElement = document.getElementById("difficulty");
    const objectCountElement = document.getElementById("objectCount");
    const displayTimeElement = document.getElementById("displayTime");
    const confidenceElement = document.getElementById("confidence");

    if (difficultyElement) {
        difficultyElement.textContent = difficulty;
    }

    if (objectCountElement) {
        objectCountElement.textContent = settings.objects;
    }

    if (displayTimeElement) {
        displayTimeElement.textContent = `${settings.displayTime} seconds`;
    }

    if (confidenceElement && adaptiveResult) {
        confidenceElement.textContent =
            `${(adaptiveResult.confidence * 100).toFixed(1)}%`;
    }
}

function chooseRandomObjects(count) {
    const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, count);
}

function startGame() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;

    selectedObjects = [];
    correctObjects = chooseRandomObjects(settings.objects);

    const startButton = document.getElementById("startGame");

    if (startButton) {
        startButton.disabled = true;
    }

    showObjects();

    setTimeout(() => {
        hideObjects();
        showRecallOptions();
        startTime = performance.now();
    }, settings.displayTime * 1000);
}

function showObjects() {
    const area = document.getElementById("gameArea");

    if (!area) {
        return;
    }

    area.innerHTML = "";

    correctObjects.forEach(object => {
        const card = document.createElement("div");

        card.className = "memory-card showing";

        card.innerHTML = `
            <div class="emoji">${object.emoji}</div>
            <div>${object.name}</div>
        `;

        area.appendChild(card);
    });

    const instruction = document.getElementById("instruction");

    if (instruction) {
        instruction.textContent =
            `Remember these ${settings.objects} objects!`;
    }
}

function hideObjects() {
    const area = document.getElementById("gameArea");

    if (!area) {
        return;
    }

    area.innerHTML = `
        <div class="hidden-message">
             Objects hidden
        </div>
    `;

    const instruction = document.getElementById("instruction");

    if (instruction) {
        instruction.textContent =
            "Which objects did you see? Select them below.";
    }
}

function showRecallOptions() {
    const options = document.getElementById("options");

    if (!options) {
        return;
    }

    options.innerHTML = "";

    const allObjects = [...OBJECTS]
        .sort(() => Math.random() - 0.5);

    allObjects.forEach(object => {
        const button = document.createElement("button");

        button.className = "object-option";

        button.innerHTML = `
            <span>${object.emoji}</span>
            <span>${object.name}</span>
        `;

        button.addEventListener("click", () => {
            selectObject(object, button);
        });

        options.appendChild(button);
    });
}

function selectObject(object, button) {
    if (selectedObjects.some(item => item.name === object.name)) {
        return;
    }

    if (selectedObjects.length >= settings.objects) {
        return;
    }

    selectedObjects.push(object);

    button.classList.add("selected");

    const selectedCount = document.getElementById("selectedCount");

    if (selectedCount) {
        selectedCount.textContent =
            `${selectedObjects.length} / ${settings.objects}`;
    }

    if (selectedObjects.length === settings.objects) {
        finishGame();
    }
}

async function finishGame() {
    if (!gameStarted) {
        return;
    }

    gameStarted = false;

    const responseTime =
        (performance.now() - startTime) / 1000;

    let correct = 0;

    selectedObjects.forEach(selected => {
        const isCorrect = correctObjects.some(
            correctObject => correctObject.name === selected.name
        );

        if (isCorrect) {
            correct++;
        }
    });

    const accuracy =
        (correct / settings.objects) * 100;

    const mistakes =
        settings.objects - correct;

    const score = correct;

    let accuracyChange = 0;

    const previousAccuracy =
        Number(localStorage.getItem("memoryMatchAccuracy") || 0);

    if (previousAccuracy > 0) {
        accuracyChange = accuracy - previousAccuracy;
    }

    localStorage.setItem(
        "memoryMatchAccuracy",
        accuracy.toString()
    );

    displayResult(
        accuracy,
        score,
        correct,
        responseTime
    );

    try {
        await apiPost("/game-sessions/", {
            user_id: USER_ID,
            game_name: GAME_NAME,
            difficulty: difficulty,
            accuracy: accuracy,
            score: score,
            response_time: responseTime,
            mistakes: mistakes,
            accuracy_change: accuracyChange,
            valence: null,
            arousal: null,
            completed: true
        });

        const saveStatus = document.getElementById("saveStatus");

        if (saveStatus) {
            saveStatus.textContent =
                " Performance saved successfully";
        }

    } catch (error) {
        console.error("Could not save game session:", error);

        const saveStatus = document.getElementById("saveStatus");

        if (saveStatus) {
            saveStatus.textContent =
                " Result saved locally. It can sync later.";
        }
    }
}

function displayResult(accuracy, score, correct, responseTime) {
    const result = document.getElementById("result");

    if (!result) {
        return;
    }

    let message;

    if (accuracy >= 80) {
        message = "Excellent memory! ";
    } else if (accuracy >= 50) {
        message = "Good effort! ";
    } else {
        message = "That's okay. Let's practice again! ";
    }

    result.innerHTML = `
        <div class="result-box">
            <h2>${message}</h2>

            <p>
                <strong>Difficulty:</strong>
                ${difficulty}
            </p>

            <p>
                <strong>Correct objects:</strong>
                ${correct} / ${settings.objects}
            </p>

            <p>
                <strong>Accuracy:</strong>
                ${accuracy.toFixed(1)}%
            </p>

            <p>
                <strong>Response time:</strong>
                ${responseTime.toFixed(1)} seconds
            </p>

            <button onclick="location.reload()">
                 Play Again
            </button>
        </div>
    `;
}

