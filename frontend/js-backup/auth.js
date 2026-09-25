// ============================================================
// COGNICARE AUTHENTICATION
// FastAPI + PostgreSQL
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// ELEMENTS
// ============================================================

const loginSection = document.getElementById("login-section");
const signupSection = document.getElementById("signup-section");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const showSignupButton = document.getElementById("show-signup");
const showLoginButton = document.getElementById("show-login");

const loginMessage = document.getElementById("login-message");
const signupMessage = document.getElementById("signup-message");


// ============================================================
// SWITCH LOGIN / SIGNUP
// ============================================================

showSignupButton.addEventListener("click", function () {

    loginSection.style.display = "none";
    signupSection.style.display = "block";

    clearMessages();

});


showLoginButton.addEventListener("click", function () {

    signupSection.style.display = "none";
    loginSection.style.display = "block";

    clearMessages();

});


// ============================================================
// CLEAR MESSAGES
// ============================================================

function clearMessages() {

    loginMessage.textContent = "";
    loginMessage.className = "message";

    signupMessage.textContent = "";
    signupMessage.className = "message";

}


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(element, message, type) {

    element.textContent = message;
    element.className = "message " + type;

}


// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value;


    const button =
        document.getElementById("login-button");


    button.disabled = true;
    button.textContent = "Logging in...";

    clearMessages();


    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Invalid email or password."
            );

        }


        // ----------------------------------------------------
        // Save logged-in user locally
        // ----------------------------------------------------

        localStorage.setItem(
            "cognicare_user",
            JSON.stringify({
                user_id: data.user_id,
                name: data.name,
                email: data.email
            })
        );


        showMessage(
            loginMessage,
            "Login successful! Redirecting...",
            "success"
        );


        setTimeout(function () {

            window.location.replace("dashboard.html");

        }, 500);


    } catch (error) {

        console.error("Login error:", error);

        showMessage(
            loginMessage,
            error.message,
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "Login";

    }

});


// ============================================================
// SIGN UP
// ============================================================

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("signup-name").value.trim();

    const email =
        document.getElementById("signup-email").value.trim();

    const password =
        document.getElementById("signup-password").value;

    const age =
        Number(
            document.getElementById("signup-age").value
        );

    const preferred_language =
        document.getElementById("signup-language").value;


    const button =
        document.getElementById("signup-button");


    button.disabled = true;
    button.textContent = "Creating account...";

    clearMessages();


    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/signup`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password,

                    age: age,

                    preferred_language:
                        preferred_language

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail || "Unable to create account."
            );

        }


        showMessage(
            signupMessage,
            "Account created successfully! Please login.",
            "success"
        );


        // ----------------------------------------------------
        // Clear signup form
        // ----------------------------------------------------

        signupForm.reset();


        // ----------------------------------------------------
        // Switch to login
        // ----------------------------------------------------

        setTimeout(function () {

            signupSection.style.display = "none";
            loginSection.style.display = "block";

            document.getElementById(
                "login-email"
            ).value = email;

        }, 1000);


    } catch (error) {

        console.error("Signup error:", error);

        showMessage(
            signupMessage,
            error.message,
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "Create Account";

    }

});