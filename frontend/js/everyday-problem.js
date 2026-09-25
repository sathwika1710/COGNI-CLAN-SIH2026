// ============================================================
// COGNICARE - EVERYDAY PROBLEM SOLVER
// ============================================================

const USER_ID = Number(JSON.parse(localStorage.getItem("cognicare_user") || "{}").user_id || 0);
const GAME_NAME = "Everyday Problem Solver";


// ============================================================
// STATIC QUESTION BANK
// ============================================================

const EVERYDAY_QUESTIONS = [

    {
        question: "You are feeling thirsty. What should you do?",
        options: [
            "Drink some water",
            "Ignore it",
            "Go to sleep",
            "Turn off the lights"
        ],
        answer: 0
    },

    {
        question: "You need to take your medicine at 8 AM. What should you do?",
        options: [
            "Take it at the scheduled time",
            "Throw it away",
            "Take it next week",
            "Give it to someone else"
        ],
        answer: 0
    },

    {
        question: "The room is getting dark and you want to read. What should you do?",
        options: [
            "Turn on a light",
            "Close your eyes",
            "Turn off all lights",
            "Go outside immediately"
        ],
        answer: 0
    },

    {
        question: "You are hungry and it is lunchtime. What is the best action?",
        options: [
            "Eat a suitable meal",
            "Skip every meal",
            "Throw away the food",
            "Go back to bed"
        ],
        answer: 0
    },

    {
        question: "You cannot find your house keys. What should you do first?",
        options: [
            "Check the places where you usually keep them",
            "Buy a new house",
            "Throw away your belongings",
            "Go to sleep"
        ],
        answer: 0
    },

    {
        question: "Someone calls you and you cannot hear them clearly. What should you do?",
        options: [
            "Ask them to speak more clearly",
            "Shout at them",
            "Hang up immediately",
            "Ignore every phone call"
        ],
        answer: 0
    },

    {
        question: "You notice that the tap is running. What should you do?",
        options: [
            "Turn off the tap",
            "Leave it running",
            "Open another tap",
            "Go outside"
        ],
        answer: 0
    },

    {
        question: "You are going outside on a sunny day. What might be useful?",
        options: [
            "An umbrella or hat",
            "A blanket for sleeping",
            "A television",
            "A cooking pan"
        ],
        answer: 0
    },

    {
        question: "You have an appointment today. What should you check?",
        options: [
            "The appointment time",
            "The television volume",
            "The refrigerator temperature",
            "The garden"
        ],
        answer: 0
    },

    {
        question: "You accidentally spill water on the floor. What should you do?",
        options: [
            "Clean it up carefully",
            "Leave it there",
            "Add more water",
            "Walk away"
        ],
        answer: 0
    },

    {
        question: "You feel tired after a long day. What is a sensible choice?",
        options: [
            "Rest",
            "Skip sleep",
            "Run continuously",
            "Avoid drinking water"
        ],
        answer: 0
    },

    {
        question: "Your phone battery is almost empty. What should you do?",
        options: [
            "Charge the phone",
            "Put it in the refrigerator",
            "Throw it away",
            "Wash it"
        ],
        answer: 0
    },

    {
        question: "You want to remember an important appointment. What can help?",
        options: [
            "Set a reminder",
            "Forget about it",
            "Delete the appointment",
            "Turn off the phone"
        ],
        answer: 0
    },

    {
        question: "You cannot remember where you placed your glasses. What should you do?",
        options: [
            "Check your usual places",
            "Buy a new house",
            "Go outside",
            "Turn off the television"
        ],
        answer: 0
    },

    {
        question: "The doorbell rings while you are at home. What should you do?",
        options: [
            "Check who is at the door safely",
            "Open the door without checking",
            "Ignore all doors forever",
            "Leave the house immediately"
        ],
        answer: 0
    },

    {
        question: "You are cooking and notice that the food is burning. What should you do?",
        options: [
            "Turn off the heat and handle it safely",
            "Add more oil",
            "Leave the kitchen",
            "Turn on the television"
        ],
        answer: 0
    },

    {
        question: "You need to go somewhere tomorrow morning. What can you do today?",
        options: [
            "Prepare the things you need",
            "Forget the plan",
            "Hide your belongings",
            "Stay awake all night"
        ],
        answer: 0
    },

    {
        question: "You receive a message from a family member. What should you do?",
        options: [
            "Read it and respond if needed",
            "Delete your phone",
            "Turn off the house",
            "Throw away the phone"
        ],
        answer: 0
    },

    {
        question: "You feel confused about what you need to do next. What can help?",
        options: [
            "Check your reminder or ask someone you trust",
            "Ignore everything",
            "Leave the house",
            "Throw away your calendar"
        ],
        answer: 0
    },

    {
        question: "You see that the refrigerator door is open. What should you do?",
        options: [
            "Close the refrigerator door",
            "Open the oven",
            "Turn off the lights",
            "Go outside"
        ],
        answer: 0
    },

    {
        question: "You need to buy groceries. What can help you remember what to buy?",
        options: [
            "Make a shopping list",
            "Forget the items",
            "Throw away your wallet",
            "Stay at home without planning"
        ],
        answer: 0
    },

    {
        question: "You are going to cross a road. What should you do first?",
        options: [
            "Look for traffic and cross safely",
            "Close your eyes",
            "Run without looking",
            "Look only at your phone"
        ],
        answer: 0
    },

    {
        question: "You cannot find your wallet. What should you do?",
        options: [
            "Check where you last used or kept it",
            "Throw away your phone",
            "Go to sleep immediately",
            "Leave your home"
        ],
        answer: 0
    },

    {
        question: "You are unsure whether you locked the door. What can you do?",
        options: [
            "Check the door",
            "Ignore it",
            "Break the door",
            "Leave the house unlocked"
        ],
        answer: 0
    },

    {
        question: "You are feeling cold inside the house. What could you do?",
        options: [
            "Wear warm clothing",
            "Drink ice water",
            "Open every window",
            "Turn on the fan"
        ],
        answer: 0
    },

    {
        question: "You need to remember to drink water regularly. What can help?",
        options: [
            "Set regular reminders",
            "Avoid water",
            "Hide the water",
            "Turn off your phone"
        ],
        answer: 0
    },

    {
        question: "You notice that the floor is wet. What should you do?",
        options: [
            "Clean it and avoid slipping",
            "Run across it",
            "Add more water",
            "Ignore it"
        ],
        answer: 0
    },

    {
        question: "Your alarm rings in the morning. What should you do if you have an appointment?",
        options: [
            "Get ready for the appointment",
            "Turn off every alarm forever",
            "Go back to sleep without checking",
            "Throw away the clock"
        ],
        answer: 0
    },

    {
        question: "You have forgotten someone's name. What can you do?",
        options: [
            "Politely ask their name again",
            "Become angry",
            "Leave immediately",
            "Pretend they do not exist"
        ],
        answer: 0
    },

    {
        question: "You feel lonely and want to talk to someone. What can you do?",
        options: [
            "Call or talk to a family member or friend",
            "Avoid everyone",
            "Turn off the phone",
            "Stay silent all day"
        ],
        answer: 0
    },

    {
        question: "You notice that your phone is making a strange sound. What should you do?",
        options: [
            "Check the phone safely",
            "Put it in water",
            "Throw it immediately",
            "Ignore every warning"
        ],
        answer: 0
    },

    {
        question: "You have several tasks to complete. What is helpful?",
        options: [
            "Make a simple list",
            "Forget all tasks",
            "Do nothing",
            "Throw away your notes"
        ],
        answer: 0
    },

    {
        question: "You are unsure what a medicine is for. What should you do?",
        options: [
            "Ask a doctor, pharmacist, or caregiver",
            "Guess",
            "Take extra medicine",
            "Give it to someone else"
        ],
        answer: 0
    },

    {
        question: "You are preparing to leave home. What should you check?",
        options: [
            "Keys, phone, and necessary items",
            "Only the television",
            "Only the curtains",
            "Nothing"
        ],
        answer: 0
    },

    {
        question: "You receive a suspicious phone message asking for personal information. What should you do?",
        options: [
            "Do not share personal information and ask someone trusted",
            "Send all your details",
            "Share your password",
            "Give the message to a stranger"
        ],
        answer: 0
    },

    {
        question: "You are having difficulty remembering a daily routine. What may help?",
        options: [
            "Use a written routine or reminder",
            "Stop doing everything",
            "Avoid all schedules",
            "Delete your calendar"
        ],
        answer: 0
    },

    {
        question: "You find an item that belongs to someone else. What should you do?",
        options: [
            "Return it to the owner or hand it to a responsible person",
            "Hide it",
            "Throw it away",
            "Keep it secretly"
        ],
        answer: 0
    },

    {
        question: "You want to prepare for tomorrow. What is useful?",
        options: [
            "Plan important tasks and prepare needed items",
            "Forget tomorrow",
            "Stay awake all night",
            "Throw away your calendar"
        ],
        answer: 0
    },

    {
        question: "You cannot understand an instruction. What should you do?",
        options: [
            "Ask someone to explain it",
            "Guess immediately",
            "Ignore the instruction",
            "Throw it away"
        ],
        answer: 0
    },

    {
        question: "You notice that you have missed an important reminder. What should you do?",
        options: [
            "Check what was missed and take the appropriate next step",
            "Delete all reminders",
            "Ignore it permanently",
            "Turn off your phone"
        ],
        answer: 0
    },

    {
        question: "You are going to a familiar place but cannot remember the route. What can help?",
        options: [
            "Use a map or ask someone you trust",
            "Walk randomly",
            "Close your eyes",
            "Ignore the destination"
        ],
        answer: 0
    },

    {
        question: "You need to remember a phone number. What can help?",
        options: [
            "Save it in your phone or write it down",
            "Forget it",
            "Delete your contacts",
            "Turn off the phone"
        ],
        answer: 0
    },

    {
        question: "You are organizing your daily activities. What is helpful?",
        options: [
            "Use a simple daily schedule",
            "Avoid planning",
            "Forget appointments",
            "Change everything randomly"
        ],
        answer: 0
    },

    {
        question: "You notice that a light has been left on in an empty room. What should you do?",
        options: [
            "Turn it off if it is safe",
            "Leave it on forever",
            "Break the bulb",
            "Open the refrigerator"
        ],
        answer: 0
    },

    {
        question: "You are not sure whether you completed a household task. What can help?",
        options: [
            "Check your routine or task list",
            "Repeat everything without checking",
            "Forget the task",
            "Throw away the list"
        ],
        answer: 0
    },

    {
        question: "You want to remember an important family event. What could help?",
        options: [
            "Write it on a calendar or set a reminder",
            "Forget the date",
            "Delete your calendar",
            "Turn off your phone"
        ],
        answer: 0
    },

    {
        question: "You feel that you need help with a task. What should you do?",
        options: [
            "Ask a trusted person for help",
            "Hide the problem",
            "Become angry",
            "Ignore the situation"
        ],
        answer: 0
    },

    {
        question: "You have finished preparing food. What should you do?",
        options: [
            "Store food safely and clean the area",
            "Leave everything outside",
            "Leave the stove running",
            "Throw away all utensils"
        ],
        answer: 0
    },

    {
        question: "You are preparing to sleep. What is a useful routine?",
        options: [
            "Follow a calm bedtime routine",
            "Stay awake all night",
            "Drink lots of coffee",
            "Start a difficult task"
        ],
        answer: 0
    },

    {
        question: "You have an important note to remember. What should you do?",
        options: [
            "Write it somewhere easy to find",
            "Hide it",
            "Throw it away",
            "Forget about it"
        ],
        answer: 0
    },

    {
        question: "You are unsure about a decision involving your safety. What should you do?",
        options: [
            "Ask a trusted person for help",
            "Take a risky action immediately",
            "Ignore the concern",
            "Guess"
        ],
        answer: 0
    }

];


// ============================================================
// GAME VARIABLES
// ============================================================

let questions = [];
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let responseTimes = [];
let questionStartTime = 0;
let selectedDifficulty = "Medium";


// ============================================================
// GET AI DIFFICULTY
// ============================================================

async function loadDifficulty() {

    const difficultyElement =
        document.getElementById("difficulty");

    const confidenceElement =
        document.getElementById("confidence");

    const aiStatus =
        document.getElementById("aiStatus");

    const aiReason =
        document.getElementById("aiReason");

    try {

        aiStatus.textContent =
            "Loading Transformer recommendation...";

        const encodedGame =
            encodeURIComponent(GAME_NAME);

        const response = await fetch(
            `http://127.0.0.1:8000/adaptive/${USER_ID}/${encodedGame}`
        );

        if (!response.ok) {
            throw new Error("Adaptive API failed");
        }

        const data = await response.json();

        selectedDifficulty =
            data.recommended_difficulty || "Medium";

        difficultyElement.textContent =
            selectedDifficulty;

        const confidence =
            Number(data.confidence || 0);

        confidenceElement.textContent =
            Math.round(confidence * 100) + "%";

        aiStatus.textContent =
            "Transformer recommendation loaded successfully.";

        if (data.reason) {
            aiReason.textContent = data.reason;
        }

    } catch (error) {

        console.error(
            "Adaptive difficulty error:",
            error
        );

        selectedDifficulty = "Medium";

        difficultyElement.textContent =
            "Medium";

        confidenceElement.textContent =
            "Demo";

        aiStatus.textContent =
            "AI recommendation unavailable. Using Medium difficulty.";

        aiReason.textContent =
            "The game can continue using the default difficulty.";

    }
}


// ============================================================
// START GAME
// ============================================================

function startGame() {

    console.log("Starting Everyday Problem Solver...");

    if (!Array.isArray(EVERYDAY_QUESTIONS) ||
        EVERYDAY_QUESTIONS.length === 0) {

        console.error("Question bank is empty.");

        alert(
            "The question bank is empty. Please check everyday-problem.js."
        );

        return;
    }

    // Shuffle questions
    const shuffled =
        [...EVERYDAY_QUESTIONS].sort(
            () => Math.random() - 0.5
        );

    // Play 10 questions
    questions =
        shuffled.slice(0, 10);

    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    responseTimes = [];

    const startSection =
        document.getElementById("startSection");

    const questionSection =
        document.getElementById("questionSection");

    const resultSection =
        document.getElementById("resultSection");

    const message =
        document.getElementById("message");

    if (!startSection ||
        !questionSection ||
        !resultSection) {

        console.error(
            "Required HTML elements are missing."
        );

        return;
    }

    startSection.style.display = "none";

    resultSection.style.display = "none";

    questionSection.style.display = "block";

    if (message) {
        message.textContent = "";
    }

    document.getElementById("questionCount")
        .textContent = questions.length;

    showQuestion();
}


// ============================================================
// SHOW QUESTION
// ============================================================

function showQuestion() {

    const question =
        questions[currentQuestion];

    if (!question) {
        finishGame();
        return;
    }

    const progress =
        document.getElementById("progress");

    const questionElement =
        document.getElementById("question");

    const answersElement =
        document.getElementById("answers");

    const message =
        document.getElementById("message");

    progress.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    questionElement.textContent =
        question.question;

    answersElement.innerHTML = "";

    if (message) {
        message.textContent = "";
    }

    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className =
                "answer-button";

            button.textContent =
                option;

            button.addEventListener(
                "click",
                () => selectAnswer(index, button)
            );

            answersElement.appendChild(button);
        }
    );

    questionStartTime =
        Date.now();
}


// ============================================================
// SELECT ANSWER
// ============================================================

function selectAnswer(
    selectedIndex,
    selectedButton
) {

    const question =
        questions[currentQuestion];

    const buttons =
        document.querySelectorAll(".answer-button");

    // Prevent multiple clicks
    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );

    const responseTime =
        (Date.now() - questionStartTime) / 1000;

    responseTimes.push(responseTime);

    const isCorrect =
        selectedIndex === question.answer;

    if (isCorrect) {

        score += 10;

        correctAnswers++;

        selectedButton.classList.add(
            "correct"
        );

        document.getElementById("message")
            .textContent =
            "Correct! Well done.";

    } else {

        selectedButton.classList.add(
            "wrong"
        );

        buttons[question.answer]
            .classList.add("correct");

        document.getElementById("message")
            .textContent =
            "Good try. The correct answer is highlighted.";
    }

    setTimeout(
        () => {

            currentQuestion++;

            if (
                currentQuestion <
                questions.length
            ) {

                showQuestion();

            } else {

                finishGame();
            }

        },
        900
    );
}


// ============================================================
// FINISH GAME
// ============================================================

async function finishGame() {

    const questionSection =
        document.getElementById("questionSection");

    const resultSection =
        document.getElementById("resultSection");

    questionSection.style.display =
        "none";

    resultSection.style.display =
        "block";

    const accuracy =
        (correctAnswers / questions.length) * 100;

    const averageTime =
        responseTimes.length > 0
            ? responseTimes.reduce(
                (a, b) => a + b,
                0
            ) / responseTimes.length
            : 0;

    document.getElementById(
        "finalDifficulty"
    ).textContent =
        selectedDifficulty;

    document.getElementById(
        "finalScore"
    ).textContent =
        `${score} / ${questions.length * 10}`;

    document.getElementById(
        "finalAccuracy"
    ).textContent =
        `${accuracy.toFixed(1)}%`;

    document.getElementById(
        "finalTime"
    ).textContent =
        `${averageTime.toFixed(2)} seconds`;

    await saveGameSession(
        accuracy,
        averageTime
    );
}


// ============================================================
// SAVE RESULT TO BACKEND
// ============================================================

async function saveGameSession(
    accuracy,
    averageTime
) {

    const saveStatus =
        document.getElementById("saveStatus");

    try {

        saveStatus.textContent =
            "Saving result...";

        // Get previous sessions
        let previousAccuracy = null;

        try {

            const response =
                await fetch(
                    `http://127.0.0.1:8000/game-sessions/user/${USER_ID}`
                );

            if (response.ok) {

                const sessions =
                    await response.json();

                if (
                    Array.isArray(sessions) &&
                    sessions.length > 0
                ) {

                    const lastSession =
                        sessions[sessions.length - 1];

                    if (
                        lastSession.accuracy !== undefined &&
                        lastSession.accuracy !== null
                    ) {

                        previousAccuracy =
                            Number(
                                lastSession.accuracy
                            );
                    }
                }
            }

        } catch (error) {

            console.log(
                "Could not load previous session:",
                error
            );
        }


        let accuracyChange = 0;

        if (previousAccuracy !== null) {

            accuracyChange =
                accuracy - previousAccuracy;
        }


        const payload = {

            user_id: USER_ID,

            game_name: GAME_NAME,

            score: score,

            accuracy: accuracy,

            response_time: averageTime,

            difficulty: selectedDifficulty,

            mistakes:
                questions.length -
                correctAnswers,

            accuracy_change:
                accuracyChange,

            valence: 0.5,

            arousal: 0.5,

            completed: true
        };


        const response =
            await fetch(
                "http://127.0.0.1:8000/game-sessions/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to save game session"
            );
        }


        saveStatus.textContent =
            "Result saved successfully.";

    } catch (error) {

        console.error(
            "Save error:",
            error
        );

        saveStatus.textContent =
            "Game completed. Result could not be synced to the server.";
    }
}


// ============================================================
// PLAY AGAIN
// ============================================================

function playAgain() {

    const resultSection =
        document.getElementById("resultSection");

    resultSection.style.display =
        "none";

    startGame();
}


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Everyday Problem Solver loaded."
        );

        console.log(
            "Questions available:",
            EVERYDAY_QUESTIONS.length
        );

        const startButton =
            document.getElementById("startButton");

        const playAgainButton =
            document.getElementById(
                "playAgainButton"
            );

        if (!startButton) {

            console.error(
                "startButton was not found."
            );

            return;
        }


        startButton.addEventListener(
            "click",
            startGame
        );


        if (playAgainButton) {

            playAgainButton.addEventListener(
                "click",
                playAgain
            );
        }


        // Load Transformer recommendation
        loadDifficulty();
    }
);
