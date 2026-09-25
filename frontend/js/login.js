document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    const password =
        document.getElementById("password");

    const showPassword =
        document.getElementById("showPassword");

    const message =
        document.getElementById("loginMessage");


    /*
     * SHOW / HIDE PASSWORD
     */

    showPassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            showPassword.textContent = "Hide";

        } else {

            password.type = "password";

            showPassword.textContent = "Show";

        }

    });


    /*
     * LOGIN
     */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("userName")
                .value
                .trim();


        const userId =
            document
                .getElementById("userId")
                .value
                .trim();


        const passwordValue =
            password.value.trim();


        /*
         * Validate fields
         */

        if (!name || !userId || !passwordValue) {

            message.textContent =
                "Please complete all fields.";

            message.style.color =
                "#e05252";

            return;
        }


        /*
         * Store prototype login session
         */

        localStorage.setItem(
            "cognicare_logged_in",
            "true"
        );


        localStorage.setItem(
            "cognicare_user_id",
            userId
        );


        localStorage.setItem(
            "cognicare_user_name",
            name
        );


        /*
         * Success message
         */

        message.textContent =
            "Welcome! Opening your CogniCare space...";

        message.style.color =
            "#20a66a";


        /*
         * GO TO EXISTING INDEX.HTML
         */

        setTimeout(() => {

            window.location.href =
                "index.html";

        }, 550);

    });

});