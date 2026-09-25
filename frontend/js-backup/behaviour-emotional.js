const USER_ID = 3;
const GAME_NAME = "Behaviour & Emotional Response";

const QUESTIONS = [
    {
        question: "You are sitting with a family member who looks worried. What would be a helpful response?",
        options: [
            "Ask them gently what is bothering them.",
            "Ignore them completely.",
            "Tell them not to talk about it."
        ],
        answer: 0
    },
    {
        question: "You forgot where you placed an everyday object. What is a helpful first step?",
        options: [
            "Stay calm and think about where you used it last.",
            "Become angry immediately.",
            "Give up without trying to remember."
        ],
        answer: 0
    },
    {
        question: "A friend tells you some good news. How could you respond?",
        options: [
            "Show interest and congratulate them.",
            "Change the topic immediately.",
            "Tell them their news is not important."
        ],
        answer: 0
    },
    {
        question: "You feel tired during an activity. What is a sensible response?",
        options: [
            "Take a short break and continue when comfortable.",
            "Force yourself to continue without a break.",
            "Become upset with everyone around you."
        ],
        answer: 0
    },
    {
        question: "Someone makes a small mistake while helping you. What is a helpful response?",
        options: [
            "Speak calmly and explain what you need.",
            "Shout at them.",
            "Stop communicating with them."
        ],
        answer: 0
    }
];

let difficulty = "Easy";
let confidence = 0;

let currentQuestion = 0;
let selectedAnswer = null;
let correctAnswers = 0;
let mistakes = 0;

let startTime = null;
let totalResponseTime = 0;

let answers = [];


// --------------------------------------------------
// LOAD AI ADAPTIVE DIFFICULTY
// --------------------------------------------------

async function loadAdaptiveDifficulty() {

    try {

        const result = await getAdaptiveDifficulty(
            USER_ID,
            GAME_NAME
        );

        difficulty = result.recommended_difficulty || "Easy";
        confidence = result.confidence || 0;

        document.getElementById("difficultyValue").textContent =
            difficulty;

        document.getElementById("confidenceValue").textContent =
            (confidence * 100).toFixed(1) + "%";

        document.getElementById("aiRecommendation").textContent =
            "AI recommendation: " +
            difficulty +
            " difficulty based on recent performance.";

    } catch (error) {

        console.error(
            "Adaptive difficulty error:",
            error
        );

        difficulty = "Easy";
        confidence = 0;

        document.getElementById("difficultyValue").textContent =
            "Easy";

        document.getElementById("confidenceValue").textContent =
            "0%";

        document.getElementById("aiRecommendation").textContent =
            "AI service unavailable. Using Easy difficulty.";
    }
}


// --------------------------------------------------
// START GAME
// --------------------------------------------------

function startGame() {

    currentQuestion = 0;
    selectedAnswer = null;
    correctAnswers = 0;
    mistakes = 0;
    totalResponseTime = 0;
    answers = [];

    document.getElementById("startScreen")
        .classList.add("hidden");

    document.getElementById("questionScreen")
        .classList.remove("hidden");

    startTime = performance.now();

    showQuestion();
}


// --------------------------------------------------
// SHOW QUESTION
// --------------------------------------------------

function showQuestion() {

    const q = QUESTIONS[currentQuestion];

    selectedAnswer = null;

    document.getElementById("questionNumber")
        .textContent =
        `Situation ${currentQuestion + 1} of ${QUESTIONS.length}`;

    document.getElementById("questionText")
        .textContent = q.question;

    document.getElementById("progressText")
        .textContent =
        `${currentQuestion + 1} / ${QUESTIONS.length}`;

    const container =
        document.getElementById("optionsContainer");

    container.innerHTML = "";

    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "option";

        button.textContent =
            `${String.fromCharCode(65 + index)}. ${option}`;

        button.onclick = function () {

            document
                .querySelectorAll(".option")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            selectedAnswer = index;
        };

        container.appendChild(button);
    });

    const nextButton =
        document.getElementById("nextButton");

    if (currentQuestion === QUESTIONS.length - 1) {
        nextButton.textContent = "Finish →";
    } else {
        nextButton.textContent = "Next →";
    }
}


// --------------------------------------------------
// NEXT QUESTION
// --------------------------------------------------

function nextQuestion() {

    if (selectedAnswer === null) {

        alert(
            "Please choose one response before continuing."
        );

        return;
    }

    const q = QUESTIONS[currentQuestion];

    const isCorrect =
        selectedAnswer === q.answer;

    if (isCorrect) {
        correctAnswers++;
    } else {
        mistakes++;
    }

    answers.push({
        question: currentQuestion + 1,
        selected: selectedAnswer,
        correct: isCorrect
    });

    if (currentQuestion === QUESTIONS.length - 1) {

        finishGame();

        return;
    }

    currentQuestion++;

    showQuestion();
}


// --------------------------------------------------
// FINISH GAME
// --------------------------------------------------

function finishGame() {

    const endTime = performance.now();

    totalResponseTime =
        (endTime - startTime) / 1000;

    document.getElementById("questionScreen")
        .classList.add("hidden");

    document.getElementById("resultScreen")
        .classList.remove("hidden");

    const accuracy =
        (correctAnswers / QUESTIONS.length) * 100;

    document.getElementById("resultDifficulty")
        .textContent = difficulty;

    document.getElementById("resultScore")
        .textContent = correctAnswers;

    document.getElementById("resultAccuracy")
        .textContent =
        accuracy.toFixed(1) + "%";

    document.getElementById("resultTime")
        .textContent =
        totalResponseTime.toFixed(1);

    document.getElementById("resultMistakes")
        .textContent = mistakes;

    document.getElementById("saveStatus")
        .textContent =
        "Please select your mood and energy, then save the activity.";
}


// --------------------------------------------------
// SAVE EMOTIONAL METRICS + GAME SESSION
// --------------------------------------------------

async function saveEmotionalMetrics() {

    const valence =
        Number(
            document.getElementById("valence").value
        );

    const arousal =
        Number(
            document.getElementById("arousal").value
        );

    const accuracy =
        (correctAnswers / QUESTIONS.length) * 100;

    const previousAccuracy =
        Number(
            localStorage.getItem(
                "cognicare_previous_behaviour_accuracy"
            ) || 0
        );

    const accuracyChange =
        previousAccuracy === 0
            ? 0
            : accuracy - previousAccuracy;

    const sessionData = {

        user_id: USER_ID,

        game_name: GAME_NAME,

        difficulty: difficulty,

        accuracy: Number(
            accuracy.toFixed(2)
        ),

        score: correctAnswers,

        response_time: Number(
            totalResponseTime.toFixed(2)
        ),

        mistakes: mistakes,

        accuracy_change: Number(
            accuracyChange.toFixed(2)
        ),

        valence: valence,

        arousal: arousal,

        completed: true
    };


    // Store latest accuracy locally
    localStorage.setItem(
        "cognicare_previous_behaviour_accuracy",
        accuracy.toString()
    );


    try {

        const result =
            await apiPost(
                "/game-sessions/",
                sessionData
            );

        console.log(
            "Behaviour session saved:",
            result
        );

        document.getElementById("saveStatus")
            .textContent =
            "✅ Activity saved successfully to CogniCare.";

    } catch (error) {

        console.error(
            "Could not save to backend:",
            error
        );

        // Offline fallback
        const pending =
            JSON.parse(
                localStorage.getItem(
                    "cognicare_pending_sessions"
                ) || "[]"
            );

        pending.push(sessionData);

        localStorage.setItem(
            "cognicare_pending_sessions",
            JSON.stringify(pending)
        );

        document.getElementById("saveStatus")
            .textContent =
            "📱 Saved locally. It can sync when the connection is available.";
    }
}


// --------------------------------------------------
// LOAD AI WHEN PAGE OPENS
// --------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdaptiveDifficulty();

    }
);