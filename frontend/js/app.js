console.log("CogniCare Dashboard loaded.");

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dashboard is ready.");

    const buttons = document.querySelectorAll(".dashboard-button, .quick-action");

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            console.log("Opening:", button.innerText.trim());
        });
    });

});
