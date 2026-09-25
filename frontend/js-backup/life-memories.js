const USER_ID = 3;

console.log("CogniCare Life Memories loaded.");

const form = document.getElementById("memoryForm");
const memoryList = document.getElementById("memoryList");
const statusMessage = document.getElementById("statusMessage");


// --------------------------------------------------
// Show status message
// --------------------------------------------------

function showStatus(message, type = "success") {

    statusMessage.innerHTML = `
        <div class="status-message ${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        statusMessage.innerHTML = "";
    }, 4000);
}


// --------------------------------------------------
// Load saved memories
// --------------------------------------------------

async function loadMemories() {

    try {

        /*
         * Try the existing backend memory endpoint.
         */

        const response = await apiGet(
            `/memories/user/${USER_ID}`
        );

        displayMemories(response);

    } catch (error) {

        console.error("Memory loading error:", error);

        /*
         * If the backend memory endpoint is not ready,
         * keep the page usable using browser storage.
         */

        displayLocalMemories();
    }
}


// --------------------------------------------------
// Display memories
// --------------------------------------------------

function displayMemories(data) {

    let memories = data;

    if (!Array.isArray(memories)) {
        memories = data.memories || [];
    }

    if (memories.length === 0) {

        memoryList.innerHTML = `
            <div class="saved-memory">
                <h3>🌱 No memories saved yet</h3>
                <p>
                    Add your first special memory above.
                </p>
            </div>
        `;

        return;
    }

    memoryList.innerHTML = memories.map(memory => {

        const title =
            memory.title ||
            memory.memory_title ||
            "My Memory";

        const text =
            memory.content ||
            memory.memory_text ||
            memory.description ||
            "";

        return `
            <div class="saved-memory">

                <h3>💖 ${escapeHtml(title)}</h3>

                <p>
                    ${escapeHtml(text)}
                </p>

            </div>
        `;

    }).join("");
}


// --------------------------------------------------
// Save memory locally
// --------------------------------------------------

function saveLocalMemory(title, text) {

    const memories =
        JSON.parse(
            localStorage.getItem("cognicare_memories") || "[]"
        );

    memories.unshift({

        id: Date.now(),

        title: title,

        content: text,

        created_at: new Date().toISOString()

    });

    localStorage.setItem(
        "cognicare_memories",
        JSON.stringify(memories)
    );
}


// --------------------------------------------------
// Display local memories
// --------------------------------------------------

function displayLocalMemories() {

    const memories =
        JSON.parse(
            localStorage.getItem("cognicare_memories") || "[]"
        );

    displayMemories(memories);
}


// --------------------------------------------------
// Submit memory
// --------------------------------------------------

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const title =
        document.getElementById("memoryTitle").value.trim();

    const text =
        document.getElementById("memoryText").value.trim();

    if (!title || !text) {

        showStatus(
            "Please enter both a title and memory.",
            "error"
        );

        return;
    }

    const body = {

        user_id: USER_ID,

        title: title,

        content: text

    };


    try {

        /*
         * Try saving to PostgreSQL through FastAPI.
         */

        await apiPost(
            "/memories/",
            body
        );

        showStatus(
            "✅ Your memory has been saved.",
            "success"
        );

        form.reset();

        await loadMemories();

    } catch (error) {

        console.error(
            "Backend memory save failed:",
            error
        );

        /*
         * Temporary offline support.
         */

        saveLocalMemory(
            title,
            text
        );

        showStatus(
            "📱 Memory saved on this device. It can be synchronized when connectivity is available.",
            "success"
        );

        form.reset();

        displayLocalMemories();
    }

});


// --------------------------------------------------
// HTML safety
// --------------------------------------------------

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// --------------------------------------------------
// Start
// --------------------------------------------------

loadMemories();