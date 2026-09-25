/*
=========================================================
CogniCare - Authentication Guard
=========================================================
*/

window.addEventListener("load", async function () {

    console.log("CogniCare auth guard starting...");

    const CLERK_SCRIPT =
        "https://valid-adder-3081.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js";

    const CLERK_KEY =
        "pk_test_dmFsaWQtYWRkZXItMzA4MS5jbGVyay5hY2NvdW50cy5kZXYk";


    function loadClerk() {

        return new Promise((resolve, reject) => {

            // Clerk already loaded
            if (typeof Clerk !== "undefined") {
                resolve();
                return;
            }

            // Check whether script is already loading
            const existingScript =
                document.querySelector(
                    'script[src*="clerk.browser.js"]'
                );

            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    () => resolve()
                );

                existingScript.addEventListener(
                    "error",
                    () => reject(
                        new Error("Clerk SDK failed to load")
                    )
                );

                return;
            }


            // Create Clerk script
            const script =
                document.createElement("script");

            script.src = CLERK_SCRIPT;
            script.async = true;
            script.crossOrigin = "anonymous";

            script.setAttribute(
                "data-clerk-publishable-key",
                CLERK_KEY
            );


            script.onload = () => {

                console.log(
                    "Clerk SDK loaded by auth guard."
                );

                resolve();

            };


            script.onerror = () => {

                reject(
                    new Error(
                        "Unable to load Clerk SDK."
                    )
                );

            };


            document.head.appendChild(script);

        });

    }


    async function protectPage() {

        try {

            await loadClerk();


            /*
            Wait for Clerk initialization
            */

            await Clerk.load();


            console.log(
                "Clerk initialized."
            );


            /*
            Check authentication
            */

            if (!Clerk.isSignedIn) {

                console.log(
                    "User is NOT signed in."
                );


                const currentPage =
                    window.location.pathname
                        .split("/")
                        .pop();


                if (
                    currentPage &&
                    currentPage !== "auth.html"
                ) {

                    sessionStorage.setItem(
                        "cognicare_redirect_after_login",
                        currentPage
                    );

                }


                /*
                IMPORTANT:
                Use replace instead of href.
                This prevents building a redirect
                history chain.
                */

                window.location.replace(
                    "auth.html"
                );

                return;

            }


            /*
            User is authenticated.
            */

            console.log(
                "Authenticated user detected."
            );


            /*
            Store user information
            */

            try {

                const user = Clerk.user;

                if (user) {

                    const userName =
                        user.firstName ||
                        user.username ||
                        "User";


                    localStorage.setItem(
                        "cognicare_user_name",
                        userName
                    );


                    localStorage.setItem(
                        "cognicare_clerk_user_id",
                        user.id
                    );

                }

            }

            catch (userError) {

                console.warn(
                    "Could not read Clerk user:",
                    userError
                );

            }


            console.log(
                "Authentication guard passed."
            );

        }

        catch (error) {

            console.error(
                "Authentication guard error:",
                error
            );


            /*
            Do NOT create an infinite redirect loop
            when Clerk itself fails to load.
            */

            document.body.innerHTML = `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    text-align: center;
                ">
                    <h2>CogniCare Authentication Error</h2>
                    <p>Unable to initialize secure authentication.</p>
                    <button
                        onclick="location.reload()"
                        style="
                            padding: 10px 20px;
                            cursor: pointer;
                        "
                    >
                        Retry
                    </button>
                </div>
            `;

        }

    }


    protectPage();

});