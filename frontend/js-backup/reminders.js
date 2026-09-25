const USER_ID = 3;

const reminderForm = document.getElementById("reminderForm");
const reminderList = document.getElementById("reminderList");
const statusMessage = document.getElementById("statusMessage");

let reminders = JSON.parse(
    localStorage.getItem("cognicare_reminders") || "[]"
);


// Display reminders
function displayReminders() {

    if (reminders.length === 0) {
        reminderList.innerHTML = `
            <div class="empty-message">
                🔔 No reminders added yet.
            </div>
        `;
        return;
    }

    reminderList.innerHTML = reminders.map((reminder, index) => `
        <div class="reminder-item">

            <div>
                <h3>${reminder.icon} ${escapeHtml(reminder.title)}</h3>

                <p>
                    <strong>Type:</strong> ${escapeHtml(reminder.type)}
                </p>

                <p>
                    <strong>Date:</strong> ${escapeHtml(reminder.date)}
                </p>

                <p>
                    <strong>Time:</strong> ${escapeHtml(reminder.time)}
                </p>

                ${reminder.notes ? `
                    <p>
                        <strong>Notes:</strong>
                        ${escapeHtml(reminder.notes)}
                    </p>
                ` : ""}
            </div>

            <button
                class="delete-button"
                onclick="deleteReminder(${index})">
                🗑️ Delete
            </button>

        </div>
    `).join("");
}


// Add reminder
reminderForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const type =
        document.getElementById("reminderType").value;

    const title =
        document.getElementById("reminderTitle").value.trim();

    const date =
        document.getElementById("reminderDate").value;

    const time =
        document.getElementById("reminderTime").value;

    const notes =
        document.getElementById("reminderNotes").value.trim();


    if (!title || !date || !time) {

        showStatus(
            "⚠️ Please fill in the title, date and time.",
            "error"
        );

        return;
    }


    const icons = {
        "Medicine": "💊",
        "Hydration": "💧",
        "Daily Activity": "🚶",
        "Medical Appointment": "🏥"
    };


    const reminder = {

        id: Date.now(),

        user_id: USER_ID,

        type: type,

        title: title,

        date: date,

        time: time,

        notes: notes,

        icon: icons[type] || "🔔"

    };


    reminders.unshift(reminder);


    localStorage.setItem(
        "cognicare_reminders",
        JSON.stringify(reminders)
    );


    showStatus(
        "✅ Reminder saved successfully.",
        "success"
    );


    reminderForm.reset();

    displayReminders();


    // Try backend synchronization
    try {

        await apiPost(
            "/reminders/",
            {
                user_id: USER_ID,
                title: title,
                reminder_type: type,
                reminder_date: date,
                reminder_time: time,
                notes: notes,
                completed: false
            }
        );

        console.log("Reminder synchronized with backend.");

    } catch (error) {

        console.log(
            "Offline mode: reminder remains stored on this device."
        );

    }

});


// Delete reminder
function deleteReminder(index) {

    if (!confirm("Delete this reminder?")) {
        return;
    }

    reminders.splice(index, 1);

    localStorage.setItem(
        "cognicare_reminders",
        JSON.stringify(reminders)
    );

    displayReminders();

    showStatus(
        "🗑️ Reminder deleted.",
        "success"
    );
}


// Status message
function showStatus(message, type) {

    statusMessage.innerHTML = `
        <div class="status-message ${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        statusMessage.innerHTML = "";
    }, 4000);
}


// Prevent HTML injection
function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// Initial load
displayReminders();