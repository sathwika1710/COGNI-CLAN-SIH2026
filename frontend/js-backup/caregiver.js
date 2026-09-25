// ============================================================
// CogniCare - Caregiver Dashboard
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";
const USER_ID = 3;

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
// Load Patient Information
// ------------------------------------------------------------

async function loadPatient() {
    try {
        const user = await fetchJSON(`${API_BASE_URL}/users/${USER_ID}`);

        const statusElement = document.getElementById("status");

        if (statusElement) {
            statusElement.textContent = "Active";
        }

        console.log("Patient:", user);

    } catch (error) {
        console.error("Patient loading error:", error);

        const statusElement = document.getElementById("status");

        if (statusElement) {
            statusElement.textContent = "Offline";
        }
    }
}

// ------------------------------------------------------------
// Load Game Sessions
// ------------------------------------------------------------

async function loadGameSessions() {

    const activitiesElement = document.getElementById("activities");

    try {
        const sessions = await fetchJSON(
            `${API_BASE_URL}/game-sessions/user/${USER_ID}`
        );

        console.log("Game sessions:", sessions);

        if (!Array.isArray(sessions) || sessions.length === 0) {

            if (activitiesElement) {
                activitiesElement.innerHTML = `
                    <div class="activity-item">
                        <div>
                            <strong>No activities yet</strong>
                            <p>Game activity will appear here after the user plays.</p>
                        </div>
                    </div>
                `;
            }

            updateStats([]);
            return;
        }

        updateStats(sessions);
        displayRecentActivities(sessions);

    } catch (error) {

        console.error("Game session loading error:", error);

        if (activitiesElement) {
            activitiesElement.innerHTML = `
                <div class="activity-item">
                    <div>
                        <strong>Unable to load activities</strong>
                        <p>Please make sure the backend server is running.</p>
                    </div>
                </div>
            `;
        }
    }
}

// ------------------------------------------------------------
// Calculate Statistics
// ------------------------------------------------------------

function updateStats(sessions) {

    const totalSessionsElement =
        document.getElementById("totalActivities");

    const averageAccuracyElement =
        document.getElementById("averageAccuracy");

    const averageResponseElement =
        document.getElementById("averageResponse");

    const bestPerformanceElement =
        document.getElementById("bestPerformance");


    if (!sessions.length) {

        if (totalSessionsElement)
            totalSessionsElement.textContent = "0";

        if (averageAccuracyElement)
            averageAccuracyElement.textContent = "0%";

        if (averageResponseElement)
            averageResponseElement.textContent = "0s";

        if (bestPerformanceElement)
            bestPerformanceElement.textContent = "0%";

        return;
    }


    // Accuracy
    const accuracies = sessions
        .map(session => Number(session.accuracy))
        .filter(value => !isNaN(value));

    const averageAccuracy =
        accuracies.length
            ? accuracies.reduce((a, b) => a + b, 0) / accuracies.length
            : 0;

    const bestAccuracy =
        accuracies.length
            ? Math.max(...accuracies)
            : 0;


    // Response time
    const responseTimes = sessions
        .map(session => Number(session.response_time))
        .filter(value => !isNaN(value));

    const averageResponse =
        responseTimes.length
            ? responseTimes.reduce((a, b) => a + b, 0) /
              responseTimes.length
            : 0;


    if (totalSessionsElement) {
        totalSessionsElement.textContent = sessions.length;
    }

    if (averageAccuracyElement) {
        averageAccuracyElement.textContent =
            `${averageAccuracy.toFixed(1)}%`;
    }

    if (averageResponseElement) {
        averageResponseElement.textContent =
            `${averageResponse.toFixed(1)}s`;
    }

    if (bestPerformanceElement) {
        bestPerformanceElement.textContent =
            `${bestAccuracy.toFixed(1)}%`;
    }
}

// ------------------------------------------------------------
// Display Recent Activities
// ------------------------------------------------------------

function displayRecentActivities(sessions) {

    const activitiesElement =
        document.getElementById("activities");

    if (!activitiesElement) return;


    // Newest activities first
    const recentSessions = [...sessions]
        .reverse()
        .slice(0, 5);


    activitiesElement.innerHTML = recentSessions
        .map(session => {

            const gameName =
                session.game_name ||
                session.game_type ||
                "Cognitive Game";

            const accuracy =
                Number(session.accuracy || 0);

            const score =
                Number(session.score || 0);

            const responseTime =
                Number(session.response_time || 0);

            const difficulty =
                session.difficulty ||
                "Medium";


            return `
                <div class="activity-item">

                    <div>
                        <strong>
                            ${escapeHTML(gameName)}
                        </strong>

                        <p>
                            Difficulty:
                            ${escapeHTML(difficulty)}
                        </p>
                    </div>

                    <div class="activity-score">

                        <strong>
                            ${accuracy.toFixed(1)}%
                        </strong>

                        <span>
                            Score: ${score}
                        </span>

                        <span>
                            ${responseTime.toFixed(1)}s
                        </span>

                    </div>

                </div>
            `;
        })
        .join("");
}

// ------------------------------------------------------------
// Load Latest Cognitive Screening
// ------------------------------------------------------------

async function loadLatestScreening() {

    const alertBox =
        document.getElementById("alertBox");

    try {

        const screening = await fetchJSON(
            `${API_BASE_URL}/cognitive-screenings/user/${USER_ID}/latest`
        );

        console.log("Latest screening:", screening);


        const category =
            screening.result_category ||
            screening.category ||
            "Screening completed";


        const percentage =
            Number(
                screening.percentage ||
                0
            );


        let message = "";

        if (
            category.toLowerCase().includes("few")
        ) {

            message =
                "The latest screening reports few cognitive symptoms.";

        } else if (
            category.toLowerCase().includes("some")
        ) {

            message =
                "Some cognitive symptoms were reported. Continue observing the user's daily activities.";

        } else if (
            category.toLowerCase().includes("several")
        ) {

            message =
                "Several cognitive symptoms were reported. Consider discussing the observations with a qualified healthcare professional.";

        } else {

            message =
                "Latest cognitive screening completed.";
        }


        if (alertBox) {

            alertBox.innerHTML = `
                <div class="alert-content">

                    <div class="alert-icon">
                        🧠
                    </div>

                    <div>

                        <strong>
                            Latest Cognitive Screening
                        </strong>

                        <p>
                            ${escapeHTML(category)}
                        </p>

                        <small>
                            Score: ${percentage.toFixed(1)}%
                        </small>

                        <p>
                            ${message}
                        </p>

                        <small>
                            Screening is supportive only and does not provide a medical diagnosis.
                        </small>

                    </div>

                </div>
            `;
        }

    } catch (error) {

        console.log(
            "No latest screening available:",
            error
        );

        if (alertBox) {

            alertBox.innerHTML = `
                <div class="alert-content">

                    <div class="alert-icon">
                        🧠