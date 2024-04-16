import { log } from "./main.js";

document.addEventListener("DOMContentLoaded", function() {
    const usernameField = document.getElementById("usernameField");
    const passwordField = document.getElementById("passwordField");
    const loginButton = document.getElementById("loginButton");
    const authenticationButtons = document.getElementById("authButtons");
    let feedbackText = document.getElementById("feedbackText");

    function displayError(error) {
        feedbackText.style.visibility = "visible";
        feedbackText.innerText = error;

        setTimeout(() => {
            feedbackText.style.visibility = "hidden";
            feedbackText.innerText = "";
        }, 3000);
    }

    function handleAuth(event) {
        const clickedButton = event.target;

        if (clickedButton.id === "loginButton") {
            handleLogin();
        } else if (clickedButton.id === "registerButton") {
            handleRegister();
        }
    }

    function handleLogin() {
        console.log("login");
    }

    function handleRegister() {
        const username = usernameField.value;
        const password = passwordField.value;

        if (username.trim() === "") {
            displayError("Username cannot be empty!")
            log("error", "Username cannot be empty.");
            return;
        }
    
        if (password.trim() === "") {
            displayError("Password cannot be empty!")
            log("error", "Password cannot be empty.");
            return;
        }

        if(password.length < 8) {
            displayError("Password must contain at least 8 characters!")
            log("error", "Password must contain at least 8 characters.");
            return;
        }

        log("info", ":)");
    }

    authenticationButtons.addEventListener("click", handleAuth);
});