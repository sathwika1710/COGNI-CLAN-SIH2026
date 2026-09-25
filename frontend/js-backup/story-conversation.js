const USER_ID = 3;
const GAME_NAME = "Story & Conversation";

let difficulty = "Easy";
let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let mistakes = 0;
let gameStartTime = 0;
let questionStartTime = 0;
let totalResponseTime = 0;

const QUESTION_BANK = {

    Easy: [
        {
            question: "What was Meera doing when she woke up?",
            options: [
                "She opened the window",
                "She went shopping",
                "She cooked lunch",
                "She went to school"
            ],
            answer: 0
        },
        {
            question: "What did Meera hear outside?",
            options: [
                "Cars",
                "Birds singing",
                "Music",
                "People shouting"
            ],
            answer: 1
        },
        {
            question: "What did Meera do in the garden?",
            options: [
                "Planted a tree",
                "Watered the flowers",
                "Picked mangoes",
                "Cleaned the garden"
            ],
            answer: 1
        },
        {
            question: "Who visited Meera?",
            options: [
                "Her friend",
                "Her neighbour",
                "Her grandson Arun",
                "Her doctor"
            ],
            answer: 2
        },
        {
            question: "What did Arun bring?",
            options: [
                "A basket of fresh fruits",
                "A book",
                "Flowers",
                "Medicine"
            ],
            answer: 0
        }
    ],

    Medium: [
        {
            question: "When did Meera wake up?",
            options: [
                "Early in the morning",
                "At noon",
                "In the evening",
                "At midnight"
            ],
            answer: 0
        },
        {
            question: "Where did Meera hear the birds?",
            options: [
                "At the market",
                "Outside her window",
                "At the temple",
                "At the school"
            ],
            answer: 1
        },
        {
            question: "What did Meera water?",
            options: [
                "Trees",
                "Vegetables",
                "Flowers",
                "Grass"
            ],
            answer: 2
        },
        {
            question: "Who brought the fruits?",
            options: [
                "Meera",
                "Arun",
                "A neighbour",
                "A shopkeeper"
            ],
            answer: 1
        },
        {
            question: "Where did Meera and Arun sit?",
            options: [
                "In the kitchen",
                "In the garden",
                "On the veranda",
                "In the bedroom"
            ],
            answer: 2
        },
        {
            question: "What did they enjoy together?",
            options: [
                "Coffee",
                "Juice",
                "A cup of tea",
                "Milk"
            ],
            answer: 2
        },
        {
            question: "What did Meera ask Arun to do?",
            options: [
                "Bring more fruits",
                "Visit again the next morning",
                "Water the garden",
                "Stay for lunch"
            ],
            answer: 1
        }
    ],

    Hard: [
        {
            question: "Which activity happened first in the story?",
            options: [
                "Arun brought fruits",
                "Meera watered flowers",
                "Meera opened the window",
                "They drank tea"
            ],
            answer: 2
        },
        {
            question: "What did Meera hear after opening the window?",
            options: [
                "Birds singing",
                "Children playing",
                "A train",
                "Rain"
            ],
            answer: 0
        },
        {
            question: "What did Meera do after hearing the birds?",
            options: [
                "Went to the market",
                "Walked to the garden",
                "Called Arun",
                "Prepared dinner"
            ],
            answer: 1
        },
        {
            question: "What did Meera do in the garden?",
            options: [
                "Watered flowers",
                "Picked fruits",
                "Planted vegetables",
                "Cleaned the garden"
            ],
            answer: 0
        },
        {
            question: "Who came to visit Meera?",
            options: [
                "Her grandson Arun",
                "Her daughter",
                "Her neighbour",
                "Her doctor"
            ],
            answer: 0
        },
        {
            question: "What was inside Arun's basket?",
            options: [
                "Vegetables",
                "Fresh fruits",
                "Books",
                "Flowers"
            ],
            answer: 1
        },
        {
            question: "Where did Meera and Arun have their conversation?",
            options: [
                "On the veranda",
                "In the garden",
                "At the market",
                "Inside the kitchen"
            ],
            answer: 0
        },
        {
            question: "What did they drink?",
            options: [
                "Tea",
                "Juice",
                "Milk",
                "Water"
            ],
            answer: 0
        },
        {
            question: "What did they talk about?",
            options: [
                "The weather only",
                "The old days",
                "Shopping",
                "School"
            ],
            answer: 1
        },
        {
            question: "When did Meera want Arun to visit again?",
            options: [
                "That evening",
                "Next week",
                "The next morning",
                "After lunch"
            ],
            answer: 2
        }
    ]
};


async function loadAdaptiveDifficulty() {

    try {

        const result = await getAdaptiveDifficulty(USER_ID, GAME_NAME);

        difficulty = result.recommended_difficulty || "Easy";

        document.getElementById("aiDifficulty").textContent =
            difficulty;

        document.getElementById("difficultyValue").textContent =
            difficulty;

        const settings = getDifficultySettings(difficulty);

        questions = QUESTION_BANK[difficulty] || QUESTION_BANK.Easy;

        document.getElementById("questionCount").textContent =
            questions.length;

        const confidence =
            Number(result.confidence || 0) * 100;

        document.getElementById("confidenceValue").textContent =
            confidence.toFixed(1) + "%";

        document.getElementById("aiReason").textContent =
            result.reason ||
            "Difficulty recommended from recent longitudinal performance.";

    } catch (error) {

        console.error("Adaptive difficulty error:", error);

        difficulty = "Easy";
        questions = QUESTION_BANK.Easy;

        document.getElementById("aiDifficulty").textContent = "Easy";
        document.getElementById("difficultyValue").textContent = "Easy";
        document.getElementById("questionCount").textContent =
            questions.length;
        document.getElementById("confidenceValue").textContent = "0%";

    }
}


function startGame() {

    if (!questions.length) {
        questions = QUESTION_BANK.Easy;
    }

    currentQuestion = 0;
    correctAnswers = 0;
    mistakes = 0;
    totalResponseTime = 0;

    gameStartTime = Date.now();

    document.getElementById("storyCard").classList.add("hidden");
    document.getElementById("gameCard").classList.remove("hidden");
    document.getElementById("resultCard").classList.add("hidden");

    showQuestion();
}


function showQuestion() {

    const q = questions[currentQuestion];

    questionStartTime = Date.now();

    document.getElementById("questionNumber").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("questionText").textContent =
        q.question;

    const progress =
        ((currentQuestion) / questions.length) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("feedback").textContent = "";

    const container =
        document.getElementById("optionsContainer");

    container.innerHTML = "";

    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "option";
        button.textContent = option;

        button.onclick = () => selectAnswer(index);

        container.appendChild(button);
    });
}


function selectAnswer(selectedIndex) {

    const q = questions[currentQuestion];

    const responseTime =
        (Date.now() - questionStartTime) / 1000;

    totalResponseTime += responseTime;

    const buttons =
        document.querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    const feedback =
        document.getElementById("feedback");

    if (selectedIndex === q.answer) {

        correctAnswers++;

        feedback.textContent = "✅ Correct! Well remembered.";

    } else {

        mistakes++;

        feedback.textContent =
            `❌ The correct answer was: ${q.options[q.answer]}`;
    }

    setTimeout(() => {

        currentQuestion++;

        if (currentQuestion < questions.length) {

            showQuestion();

        } else {

            finishGame();

        }

    }, 900);
}


async function finishGame() {

    const totalQuestions = questions.length;

    const accuracy =
        (correctAnswers / totalQuestions) * 100;

    const totalTime =
        (Date.now() - gameStartTime) / 1000;

    document.getElementById("gameCard").classList.add("hidden");
    document.getElementById("resultCard").classList.remove("hidden");

    document.getElementById("resultDifficulty").textContent =
        difficulty;

    document.getElementById("resultScore").textContent =
        `${correctAnswers} / ${totalQuestions}`;

    document.getElementById("resultAccuracy").textContent =
        accuracy.toFixed(1) + "%";

    document.getElementById("resultTime").textContent =
        totalTime.toFixed(1) + " seconds";

    document.getElementById("resultMistakes").textContent =
        mistakes;

    document.getElementById("resultTitle").textContent =
        accuracy >= 80
            ? "🎉 Excellent Conversation Memory!"
            : accuracy >= 50
                ? "👍 Good Effort!"
                : "🌱 Keep Practicing!";

    document.getElementById("progressBar").style.width = "100%";

    const averageResponseTime =
        totalTime / totalQuestions;

    const accuracyChange = 0;

    const data = {
        user_id: USER_ID,
        game_name: GAME_NAME,
        difficulty: difficulty,
        accuracy: Number(accuracy.toFixed(2)),
        score: correctAnswers,
        response_time: Number(averageResponseTime.toFixed(2)),
        mistakes: mistakes,
        accuracy_change: accuracyChange,
        valence: null,
        arousal: null,
        completed: true
    };

    try {

        await apiPost("/game-sessions/", data);

        console.log(
            "Story & Conversation saved successfully:",
            data
        );

    } catch (error) {

        console.error(
            "Backend unavailable. Saving result locally:",
            error
        );

        localStorage.setItem(
            "cognicare_story_result",
            JSON.stringify(data)
        );
    }
}


document.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("startButton")
        .addEventListener("click", startGame);

    loadAdaptiveDifficulty();

});
