const USER_ID = 3;
const GAME_NAME = "Everyday Problem Solver";

let questions = [];
let currentQuestion = 0;
let correctAnswers = 0;
let mistakes = 0;
let startTime = 0;
let totalResponseTime = 0;
let answered = false;

let difficulty = "Easy";
let questionCount = 10;


// =====================================================
// GET AI DIFFICULTY
// =====================================================

async function getDifficulty() {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/adaptive/${USER_ID}/${encodeURIComponent(GAME_NAME)}`
        );

        if (!response.ok) {
            throw new Error("AI unavailable");
        }

        const data = await response.json();

        difficulty =
            data.recommended_difficulty || "Easy";

    } catch (error) {

        console.log(
            "AI unavailable. Using Easy difficulty."
        );

        difficulty = "Easy";
    }


    const difficultyElement =
        document.getElementById("difficulty");

    if (difficultyElement) {
        difficultyElement.textContent =
            difficulty;
    }
}


// =====================================================
// START GAME
// =====================================================

async function startGame() {

    await getDifficulty();


    // Make sure question bank exists

    if (
        !window.EVERYDAY_QUESTIONS ||
        !Array.isArray(window.EVERYDAY_QUESTIONS) ||
        window.EVERYDAY_QUESTIONS.length === 0
    ) {

        console.error(
            "EVERYDAY_QUESTIONS question bank was not loaded."
        );

        alert(
            "Question bank could not be loaded. Please refresh the page."
        );

        return;
    }


    // Copy static question bank

    questions =
        [...window.EVERYDAY_QUESTIONS];


    // Shuffle

    questions.sort(
        () => Math.random() - 0.5
    );


    // Select 10 questions

    questions =
        questions.slice(0, questionCount);


    // Reset game

    currentQuestion = 0;
    correctAnswers = 0;
    mistakes = 0;
    totalResponseTime = 0;


    // Hide result

    const resultSection =
        document.getElementById("resultSection");

    if (resultSection) {
        resultSection.style.display = "none";
    }


    // Show question section

    const questionSection =
        document.getElementById("questionSection");

    if (questionSection) {
        questionSection.style.display = "block";
    }


    // Hide start button

    const startButton =
        document.getElementById("startButton");

    if (startButton) {
        startButton.style.display = "none";
    }


    showQuestion();
}


// =====================================================
// SHOW QUESTION
// =====================================================

function showQuestion() {

    answered = false;


    // Game finished

    if (
        currentQuestion >=
        questions.length
    ) {

        finishGame();

        return;
    }


    const questionData =
        questions[currentQuestion];


    const questionElement =
        document.getElementById("question");


    const optionsElement =
        document.getElementById("options");


    const progressElement =
        document.getElementById("progress");


    const messageElement =
        document.getElementById("message");


    // Question

    if (questionElement) {

        questionElement.textContent =
            questionData.question;
    }


    // Progress

    if (progressElement) {

        progressElement.textContent =
            `Question ${currentQuestion + 1} of ${questions.length}`;
    }


    // Clear message

    if (messageElement) {
        messageElement.textContent = "";
    }


    // Create answer buttons

    if (optionsElement) {

        optionsElement.innerHTML = "";


        questionData.options.forEach(
            (option, index) => {

                const button =
                    document.createElement("button");


                button.className =
                    "answer-option";


                button.textContent =
                    option;


                button.type =
                    "button";


                button.addEventListener(
                    "click",
                    () => selectAnswer(index)
                );


                optionsElement.appendChild(
                    button
                );
            }
        );
    }


    // Start response timer

    startTime =
        performance.now();
}


// =====================================================
// SELECT ANSWER
// =====================================================

function selectAnswer(selectedIndex) {

    if (answered) {
        return;
    }


    answered = true;


    // Response time

    const responseTime =
        (performance.now() - startTime) /
        1000;


    totalResponseTime +=
        responseTime;


    // Correct answer

    const correctIndex =
        questions[currentQuestion].answer;


    // Get buttons

    const buttons =
        document.querySelectorAll(
            ".answer-option"
        );


    // Disable all buttons

    buttons.forEach(
        button => {
            button.disabled = true;
        }
    );


    // Correct answer

    if (
        selectedIndex ===
        correctIndex
    ) {

        correctAnswers++;


        if (buttons[selectedIndex]) {

            buttons[selectedIndex]
                .classList.add("correct");
        }


        showMessage(
            "✅ Correct! Well done."
        );

    }

    // Wrong answer

    else {

        mistakes++;


        if (buttons[selectedIndex]) {

            buttons[selectedIndex]
                .classList.add("wrong");
        }


        if (buttons[correctIndex]) {

            buttons[correctIndex]
                .classList.add("correct");
        }


        showMessage(
            "💡 Good try! Let's continue."
        );
    }


    // Next question

    setTimeout(
        () => {

            currentQuestion++;

            showQuestion();

        },
        900
    );
}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(message) {

    const messageElement =
        document.getElementById("message");


    if (messageElement) {

        messageElement.textContent =
            message;
    }
}


// =====================================================
// FINISH GAME
// =====================================================

async function finishGame() {

    const totalQuestions =
        questions.length;


    const accuracy =
        totalQuestions > 0
            ? (
                correctAnswers /
                totalQuestions
              ) * 100
            : 0;


    const averageResponseTime =
        totalQuestions > 0
            ? totalResponseTime /
              totalQuestions
            : 0;


    const score =
        correctAnswers;


    // Hide questions

    const questionSection =
        document.getElementById(
            "questionSection"
        );


    if (questionSection) {

        questionSection.style.display =
            "none";
    }


    // Show result

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const resultElement =
        document.getElementById(
            "result"
        );


    if (
        resultSection &&
        resultElement
    ) {

        resultElement.innerHTML = `

            <h2>🌱 Keep Practicing!</h2>

            <p>
                Difficulty:
                <strong>
                    ${difficulty}
                </strong>
            </p>

            <p>
                Correct Answers:
                <strong>
                    ${correctAnswers} / ${totalQuestions}
                </strong>
            </p>

            <p>
                Accuracy:
                <strong>
                    ${accuracy.toFixed(1)}%
                </strong>
            </p>

            <p>
                Response Time:
                <strong>
                    ${averageResponseTime.toFixed(1)}
                    seconds
                </strong>
            </p>

            <p>
                Mistakes:
                <strong>
                    ${mistakes}
                </strong>
            </p>

        `;


        resultSection.style.display =
            "block";
    }


    // Save result

    await saveGameSession(
        accuracy,
        score,
        averageResponseTime
    );
}


// =====================================================
// SAVE GAME SESSION
// =====================================================

async function saveGameSession(
    accuracy,
    score,
    responseTime
) {

    try {

        let accuracyChange = 0;


        // Get previous sessions

        try {

            const previousResponse =
                await fetch(
                    `http://127.0.0.1:8000/game-sessions/user/${USER_ID}`
                );


            if (
                previousResponse.ok
            ) {

                const previousSessions =
                    await previousResponse.json();


                const previous =
                    previousSessions
                        .filter(
                            session =>
                                session.game_name ===
                                GAME_NAME
                        )
                        .sort(
                            (a, b) =>
                                new Date(
                                    b.played_at
                                ) -
                                new Date(
                                    a.played_at
                                )
                        );


                if (
                    previous.length > 0
                ) {

                    accuracyChange =
                        accuracy -
                        Number(
                            previous[0].accuracy
                        );
                }
            }

        } catch (error) {

            console.log(
                "Could not calculate accuracy change."
            );
        }


        // PostgreSQL payload

        const payload = {

            user_id: USER_ID,

            game_name: GAME_NAME,

            difficulty: difficulty,

            accuracy:
                Number(
                    accuracy.toFixed(2)
                ),

            score: score,

            response_time:
                Number(
                    responseTime.toFixed(2)
                ),

            mistakes: mistakes,

            accuracy_change:
                Number(
                    accuracyChange.toFixed(2)
                ),

            valence: null,

            arousal: null,

            completed: true
        };


        // Save to backend

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
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText
            );
        }


        console.log(
            "Everyday Problem Solver result saved:",
            payload
        );


    } catch (error) {

        console.error(
            "Could not save game session:",
            error
        );
    }
}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const startButton =
            document.getElementById(
                "startButton"
            );


        if (startButton) {

            startButton.addEventListener(
                "click",
                startGame
            );
        }


        console.log(
            "Everyday Problem Solver loaded."
        );


        console.log(
            "Question bank:",
            window.EVERYDAY_QUESTIONS
                ? `${window.EVERYDAY_QUESTIONS.length} questions loaded`
                : "NOT LOADED"
        );
    }
);