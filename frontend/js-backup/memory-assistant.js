const API_BASE_URL = "http://127.0.0.1:8000";
const USER_ID = 3;

const MEMORY_STORAGE_KEY = "cognicare_memories";


// ======================================================
// LOCAL STORAGE FALLBACK
// ======================================================

function getLocalMemories() {
    try {
        return JSON.parse(localStorage.getItem(MEMORY_STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error reading local memories:", error);
        return [];
    }
}

function saveLocalMemories(memories) {
    localStorage.setItem(
        MEMORY_STORAGE_KEY,
        JSON.stringify(memories)
    );
}


// ======================================================
// DOM ELEMENTS
// ======================================================

let memoryForm;
let memoryTitle;
let person;
let memoryDate;
let category;
let memoryPhoto;
let photoPreview;
let previewImage;
let memoryText;
let successMessage;

let memoryCount;
let searchMemory;
let memoryList;


// ======================================================
// PHOTO PREVIEW
// ======================================================

function setupPhotoPreview() {

    if (!memoryPhoto) return;

    memoryPhoto.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            if (photoPreview) {
                photoPreview.style.display = "none";
            }
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            this.value = "";

            if (photoPreview) {
                photoPreview.style.display = "none";
            }

            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {

            alert("Photo must be smaller than 5 MB.");

            this.value = "";

            if (photoPreview) {
                photoPreview.style.display = "none";
            }

            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            if (previewImage) {
                previewImage.src = event.target.result;
            }

            if (photoPreview) {
                photoPreview.style.display = "block";
            }
        };

        reader.readAsDataURL(file);
    });
}


// ======================================================
// READ PHOTO AS BASE64
// ======================================================

function readPhoto(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            resolve(event.target.result);
        };

        reader.onerror = function () {
            reject(new Error("Unable to read photo."));
        };

        reader.readAsDataURL(file);
    });
}


// ======================================================
// SAVE MEMORY TO POSTGRESQL
// ======================================================

async function saveMemoryToBackend(memoryData) {

    const response = await fetch(
        `${API_BASE_URL}/memories/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_id: USER_ID,
                title: memoryData.title,
                person: memoryData.person || "",
                date: memoryData.date || "",
                category: memoryData.category || "Personal",
                text: memoryData.text,
                photo: memoryData.photo || ""
            })
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `Backend error ${response.status}: ${errorText}`
        );
    }

    return await response.json();
}


// ======================================================
// LOAD MEMORIES FROM POSTGRESQL
// ======================================================

async function loadMemoriesFromBackend() {

    const response = await fetch(
        `${API_BASE_URL}/memories/user/${USER_ID}`
    );

    if (!response.ok) {
        throw new Error(
            `Backend error ${response.status}`
        );
    }

    return await response.json();
}


// ======================================================
// DELETE MEMORY FROM POSTGRESQL
// ======================================================

async function deleteMemoryFromBackend(memoryId) {

    const response = await fetch(
        `${API_BASE_URL}/memories/${memoryId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `Backend delete error ${response.status}: ${errorText}`
        );
    }

    return await response.json();
}


// ======================================================
// ADD MEMORY
// ======================================================

async function addMemory(event) {

    event.preventDefault();

    const titleValue = memoryTitle.value.trim();
    const personValue = person.value.trim();
    const dateValue = memoryDate.value;
    const categoryValue = category.value;
    const textValue = memoryText.value.trim();

    // Validation
    if (!titleValue) {

        alert("Please enter a memory title.");

        memoryTitle.focus();

        return;
    }

    if (!textValue) {

        alert("Please write something about this memory.");

        memoryText.focus();

        return;
    }

    // Read photo
    let photoData = "";

    try {

        if (memoryPhoto && memoryPhoto.files.length > 0) {

            photoData = await readPhoto(
                memoryPhoto.files[0]
            );
        }

    } catch (error) {

        console.error(error);

        alert("Unable to process the photo.");

        return;
    }


    // Create memory object
    const memoryData = {

        title: titleValue,

        person: personValue,

        date: dateValue,

        category: categoryValue,

        text: textValue,

        photo: photoData,

        createdAt: new Date().toISOString()
    };


    // Disable button while saving
    const submitButton =
        memoryForm.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";
    }


    try {

        // ==============================================
        // PRIMARY: SAVE TO POSTGRESQL
        // ==============================================

        const result =
            await saveMemoryToBackend(memoryData);

        console.log(
            "Memory saved to PostgreSQL:",
            result
        );


        // ==============================================
        // SHOW SUCCESS
        // ==============================================

        showSuccessMessage(
            "Memory saved successfully! ❤️"
        );


        // Reset form
        memoryForm.reset();


        if (photoPreview) {
            photoPreview.style.display = "none";
        }


        // Reload memories
        await displayMemories();


    } catch (error) {

        // ==============================================
        // FALLBACK: LOCAL STORAGE
        // ==============================================

        console.warn(
            "Backend unavailable. Saving locally.",
            error
        );


        const localMemories =
            getLocalMemories();


        const localMemory = {

            id: Date.now(),

            user_id: USER_ID,

            ...memoryData
        };


        localMemories.unshift(
            localMemory
        );


        saveLocalMemories(
            localMemories
        );


        showSuccessMessage(
            "Memory saved offline. It will remain on this device. ❤️"
        );


        memoryForm.reset();


        if (photoPreview) {
            photoPreview.style.display = "none";
        }


        displayMemories();
    }


    // Re-enable button
    if (submitButton) {

        submitButton.disabled = false;

        submitButton.textContent =
            "Save Memory";
    }
}


// ======================================================
// SUCCESS MESSAGE
// ======================================================

function showSuccessMessage(message) {

    if (!successMessage) return;

    successMessage.textContent = message;

    successMessage.style.display = "block";


    setTimeout(() => {

        successMessage.style.display = "none";

    }, 4000);
}


// ======================================================
// DELETE MEMORY
// ======================================================

async function deleteMemory(memoryId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this memory?"
        );

    if (!confirmed) return;


    try {

        // Try PostgreSQL first
        await deleteMemoryFromBackend(
            memoryId
        );


        console.log(
            "Memory deleted from PostgreSQL."
        );


        await displayMemories();


    } catch (error) {

        console.warn(
            "Backend delete failed. Trying local storage.",
            error
        );


        // Local fallback
        const memories =
            getLocalMemories();


        const updated =
            memories.filter(
                memory =>
                    String(memory.id) !==
                    String(memoryId)
            );


        saveLocalMemories(
            updated
        );


        displayMemories();
    }
}


// ======================================================
// LOAD ALL MEMORIES
// ======================================================

async function getAllMemories() {

    try {

        // PostgreSQL
        const memories =
            await loadMemoriesFromBackend();

        return {
            memories,
            source: "backend"
        };

    } catch (error) {

        console.warn(
            "Could not load PostgreSQL memories.",
            error
        );


        // LocalStorage fallback
        return {
            memories: getLocalMemories(),
            source: "local"
        };
    }
}


// ======================================================
// DISPLAY MEMORIES
// ======================================================

async function displayMemories() {

    if (!memoryList) return;


    const result =
        await getAllMemories();


    const memories =
        result.memories;


    // Update count
    if (memoryCount) {

        memoryCount.textContent =
            memories.length;
    }


    // Clear list
    memoryList.innerHTML = "";


    // No memories
    if (memories.length === 0) {

        memoryList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💭</div>

                <h3>No memories yet</h3>

                <p>
                    Add your first special memory above.
                </p>
            </div>
        `;

        return;
    }


    // Display memories
    memories.forEach(memory => {

        const card =
            document.createElement("div");

        card.className =
            "memory-card";


        // Photo
        let photoHTML = "";

        if (memory.photo) {

            photoHTML = `
                <div class="memory-photo">
                    <img
                        src="${memory.photo}"
                        alt="Memory photo"
                    >
                </div>
            `;
        }


        // Person
        let personHTML = "";

        if (memory.person) {

            personHTML = `
                <div class="memory-person">
                    👤 ${escapeHTML(memory.person)}
                </div>
            `;
        }


        // Date
        let dateHTML = "";

        if (memory.date) {

            dateHTML = `
                <div class="memory-date">
                    📅 ${escapeHTML(memory.date)}
                </div>
            `;
        }


        // Category
        let categoryHTML = "";

        if (memory.category) {

            categoryHTML = `
                <span class="memory-category">
                    ${escapeHTML(memory.category)}
                </span>
            `;
        }


        card.innerHTML = `

            ${photoHTML}

            <div class="memory-content">

                <div class="memory-header">

                    ${categoryHTML}

                    <button
                        class="delete-memory"
                        onclick="deleteMemory(${memory.id})"
                        title="Delete memory"
                    >
                        🗑️
                    </button>

                </div>


                <h3>
                    ${escapeHTML(memory.title)}
                </h3>


                ${personHTML}

                ${dateHTML}


                <p class="memory-text">
                    ${escapeHTML(memory.text)}
                </p>

            </div>
        `;


        memoryList.appendChild(card);
    });
}


// ======================================================
// SEARCH MEMORIES
// ======================================================

async function searchMemories() {

    const searchTerm =
        searchMemory.value
            .trim()
            .toLowerCase();


    const result =
        await getAllMemories();


    const memories =
        result.memories;


    if (!searchTerm) {

        renderMemoryCards(memories);

        return;
    }


    const filtered =
        memories.filter(memory => {

            return (

                (memory.title || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (memory.person || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (memory.category || "")
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                (memory.text || "")
                    .toLowerCase()
                    .includes(searchTerm)
            );
        });


    renderMemoryCards(filtered);
}


// ======================================================
// RENDER MEMORY CARDS
// ======================================================

function renderMemoryCards(memories) {

    if (!memoryList) return;


    memoryList.innerHTML = "";


    if (memoryCount) {

        memoryCount.textContent =
            memories.length;
    }


    if (memories.length === 0) {

        memoryList.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🔍
                </div>

                <h3>
                    No memories found
                </h3>

                <p>
                    Try a different search term.
                </p>

            </div>
        `;

        return;
    }


    memories.forEach(memory => {

        const card =
            document.createElement("div");


        card.className =
            "memory-card";


        let photoHTML = "";

        if (memory.photo) {

            photoHTML = `
                <div class="memory-photo">

                    <img
                        src="${memory.photo}"
                        alt="Memory photo"
                    >

                </div>
            `;
        }


        let personHTML = "";

        if (memory.person) {

            personHTML = `
                <div class="memory-person">
                    👤 ${escapeHTML(memory.person)}
                </div>
            `;
        }


        let dateHTML = "";

        if (memory.date) {

            dateHTML = `
                <div class="memory-date">
                    📅 ${escapeHTML(memory.date)}
                </div>
            `;
        }


        let categoryHTML = "";

        if (memory.category) {

            categoryHTML = `
                <span class="memory-category">
                    ${escapeHTML(memory.category)}
                </span>
            `;
        }


        card.innerHTML = `

            ${photoHTML}

            <div class="memory-content">

                <div class="memory-header">

                    ${categoryHTML}

                    <button
                        class="delete-memory"
                        onclick="deleteMemory(${memory.id})"
                        title="Delete memory"
                    >
                        🗑️
                    </button>

                </div>


                <h3>
                    ${escapeHTML(memory.title)}
                </h3>


                ${personHTML}

                ${dateHTML}


                <p class="memory-text">
                    ${escapeHTML(memory.text)}
                </p>

            </div>
        `;


        memoryList.appendChild(card);
    });
}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


// ======================================================
// EVENT LISTENERS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Get elements
        memoryForm =
            document.getElementById(
                "memoryForm"
            );

        memoryTitle =
            document.getElementById(
                "memoryTitle"
            );

        person =
            document.getElementById(
                "person"
            );

        memoryDate =
            document.getElementById(
                "memoryDate"
            );

        category =
            document.getElementById(
                "category"
            );

        memoryPhoto =
            document.getElementById(
                "memoryPhoto"
            );

        photoPreview =
            document.getElementById(
                "photoPreview"
            );

        previewImage =
            document.getElementById(
                "previewImage"
            );

        memoryText =
            document.getElementById(
                "memoryText"
            );

        successMessage =
            document.getElementById(
                "successMessage"
            );

        memoryCount =
            document.getElementById(
                "memoryCount"
            );

        searchMemory =
            document.getElementById(
                "searchMemory"
            );

        memoryList =
            document.getElementById(
                "memoryList"
            );


        // Form
        if (memoryForm) {

            memoryForm.addEventListener(
                "submit",
                addMemory
            );
        }


        // Search
        if (searchMemory) {

            searchMemory.addEventListener(
                "input",
                searchMemories
            );
        }


        // Photo preview
        setupPhotoPreview();


        // Initial load
        displayMemories();
    }
);