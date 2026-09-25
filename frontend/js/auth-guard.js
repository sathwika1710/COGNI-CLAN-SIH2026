(function () {
    const userData = localStorage.getItem("cognicare_user");

    let user = null;

    try {
        user = userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Invalid CogniCare user data:", error);
    }

    const validUser =
        user &&
        Number(user.user_id) > 0 &&
        user.email;

    if (!validUser) {
        const currentPage =
            window.location.pathname.split("/").pop();

        if (currentPage && currentPage !== "auth.html") {
            sessionStorage.setItem(
                "cognicare_redirect_after_login",
                currentPage
            );
        }

        window.location.replace("auth.html");
        return;
    }

    console.log(
        "CogniCare authentication passed. User ID:",
        user.user_id
    );

    window.COGNICARE_USER = user;
})();
