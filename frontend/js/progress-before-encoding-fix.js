// ============================================================
// CogniCare - Progress Dashboard
// ============================================================

const USER_ID = Number(JSON.parse(localStorage.getItem("cognicare_user") || "{}").user_id || 0);
const API_BASE_URL = "http://127.0.0.1:8000";

// ------------------------------------------------------------
// Helper
// ------------------------------------------------------------

async function fetchJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}


// ------------------------------------------------------------
// Load Game Activities from PostgreSQL
// ------------------------------------------------------------

async function loadActivities() {

    const gameList = document.getElementById("gameList");

    try {

        const sessions = await fetchJSON(
            `${API_BASE_URL}/game-sessions/user/${USER_ID}`
        );

        console.log("PostgreSQL game sessions:", sessions);


        if (!Array.isArray(sessions) || sessions.length === 0) {

            displayActivities([]);

            return;
        }


        // Newest activity first
        const activities = [...sessions].reverse();

        displayActivities(activities);

    } catch (error) {

        console.error(
            "Game activity loading error:",
            error
        );

        if (gameList) {

            gameList.innerHTML = `
                <div class="empty">

                    âš ï¸ Unable to load your activities.

                    <br><br>

                    Please make sure the CogniCare backend
                    is running.

                </div>
            `;
        }
    }
}


// ------------------------------------------------------------
// Display Activities + Calculate Statistics
// ------------------------------------------------------------

function displayActivities(activities) {

    const gameList =
        document.getElementById("gameList");


    if (!activities || activities.length === 0) {

        if (gameList) {

            gameList.innerHTML = `
                <div class="empty">

                    ðŸŽ® No activities completed yet.

                    <br>

                    Play a cognitive game to start
                    building your progress.

                </div>
            `;
        }

        updateSummary([]);

        return;
    }


    updateSummary(activities);


    if (!gameList) return;


    gameList.innerHTML = activities
        .map(activity => {

            const gameName =
                activity.game_name ||
                activity.game_type ||
                "Cognitive Game";


            const score =
                Number(activity.score || 0);


            const accuracy =
                Number(activity.accuracy || 0);


            const responseTime =
                Number(
                    activity.response_time || 0
                );


            const difficulty =
                activity.difficulty ||
                "Medium";


            const mistakes =
                Number(
                    activity.mistakes || 0
                );


            return `
                <div class="game-row">

                    <div class="game-name">
                        ðŸŽ®
                        ${escapeHTML(gameName)}
                    </div>


                    <div class="value">

                        Score:

                        <strong>
                            ${score}
                        </strong>

                    </div>


                    <div class="value">

                        Accuracy:

                        <strong>
                            ${accuracy.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="value">

                        Time:

                        <strong>
                            ${responseTime.toFixed(1)}s
                        </strong>

                    </div>


                    <div class="value">

                        Mistakes:

                        <strong>
                            ${mistakes}
                        </strong>

                    </div>


                    <div>

                        <span class="difficulty">
                            ${escapeHTML(difficulty)}
                        </span>

                    </div>

                </div>


                <div style="margin-bottom:12px;">

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${Math.min(
                                Math.max(accuracy, 0),
                                100
                            )}%">
                        </div>

                    </div>

                </div>
            `;

        })
        .join("");
}


// ------------------------------------------------------------
// Summary Statistics
// ------------------------------------------------------------

function updateSummary(activities) {

    const totalSessions =
        document.getElementById("totalSessions");

    const averageAccuracy =
        document.getElementById("averageAccuracy");

    const averageTime =
        document.getElementById("averageTime");

    const bestAccuracy =
        document.getElementById("bestAccuracy");


    if (!activities || activities.length === 0) {

        if (totalSessions)
            totalSessions.textContent = "0";

        if (averageAccuracy)
            averageAccuracy.textContent = "0%";

        if (averageTime)
            averageTime.textContent = "0s";

        if (bestAccuracy)
            bestAccuracy.textContent = "0%";

        return;
    }


    const accuracies =
        activities
            .map(activity =>
                Number(activity.accuracy)
            )
            .filter(value => !isNaN(value));


    const responseTimes =
        activities
            .map(activity =>
                Number(activity.response_time)
            )
            .filter(value => !isNaN(value));


    const averageAccuracyValue =
        accuracies.length
            ? accuracies.reduce(
                (sum, value) => sum + value,
                0
            ) / accuracies.length
            : 0;


    const averageTimeValue =
        responseTimes.length
            ? responseTimes.reduce(
                (sum, value) => sum + value,
                0
            ) / responseTimes.length
            : 0;


    const bestAccuracyValue =
        accuracies.length
            ? Math.max(...accuracies)
            : 0;


    if (totalSessions) {

        totalSessions.textContent =
            activities.length;
    }


    if (averageAccuracy) {

        averageAccuracy.textContent =
            `${averageAccuracyValue.toFixed(1)}%`;
    }


    if (averageTime) {

        averageTime.textContent =
            `${averageTimeValue.toFixed(1)}s`;
    }


    if (bestAccuracy) {

        bestAccuracy.textContent =
            `${bestAccuracyValue.toFixed(1)}%`;
    }
}


// ------------------------------------------------------------
// Load Transformer AI Analysis
// ------------------------------------------------------------

async function loadProgress() {

    const status =
        document.getElementById("status");

    const aiResult =
        document.getElementById("aiResult");


    try {

        if (status) {

            status.textContent =
                "Loading your progress...";
        }


        const data = await fetchJSON(
            `${API_BASE_URL}/analysis/ml/${USER_ID}`
        );


        console.log(
            "Transformer AI Analysis:",
            data
        );


        const difficulty =
            data.recommended_difficulty ||
            "Medium";


        const confidence =
            Number(data.confidence || 0);


        const confidencePercent =
            Math.max(
                0,
                Math.min(
                    confidence * 100,
                    100
                )
            );


        const reason =
            data.reason ||
            "Based on your recent longitudinal game performance.";


        if (aiResult) {

            aiResult.innerHTML = `

                <div class="ai-result-content">

                    <div class="ai-icon">
                        ðŸ¤–
                    </div>


                    <div>

                        <p>
                            Recommended difficulty:
                        </p>

                        <h3>
                            ${escapeHTML(difficulty)}
                        </h3>


                        <p>

                            Confidence:

                            <strong class="confidence">
                                ${confidencePercent.toFixed(1)}%
                            </strong>

                        </p>


                        <p>
                            ${escapeHTML(reason)}
                        </p>


                        <small>
                            Recommendation generated from
                            longitudinal game-performance data.
                        </small>

                    </div>

                </div>
            `;
        }


        if (status) {

            status.innerHTML = `
                ðŸŸ¢ Your CogniCare progress
                and AI analysis are available.
            `;
        }

    } catch (error) {

        console.error(
            "Progress AI error:",
            error
        );


        if (status) {

            status.innerHTML = `
                âš ï¸ AI analysis could not be loaded.
                Your recent activity data is still shown below.
            `;
        }


        if (aiResult) {

            aiResult.innerHTML = `
                ðŸ¤– AI recommendation is temporarily unavailable.
            `;
        }
    }
}


// ------------------------------------------------------------
// Escape HTML
// ------------------------------------------------------------

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ------------------------------------------------------------
// Initialize Progress Page
// ------------------------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "CogniCare Progress page loaded"
        );


        // Load PostgreSQL game history
        await loadActivities();


        // Load Transformer analysis
        await loadProgress();

    }
);
