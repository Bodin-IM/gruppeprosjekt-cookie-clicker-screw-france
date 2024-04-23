import { buy, sItems } from "./store.js";
import { validateAuthentication } from "./auth.js";

const cashVisualizer = document.getElementById("cash");
var totalCash = localStorage.getItem("cash");
const BATCH_SIZE = 20;
let clicks = 0;

function getCash() {
    return totalCash;
}

function manageCash(type, arg = 0){
    switch(type){
        case "inc":
            totalCash++;
            cashVisualizer.innerText = totalCash;
            break;
        case "dec":
            totalCash--;
            cashVisualizer.innerText = totalCash;
            break;
        case "set":
            totalCash = arg;
            cashVisualizer.innerText = totalCash;
            break;
    }

    storeData();
}

function storeData() {
    localStorage.setItem("cash", totalCash);
    log("success", "Stored user cash value to local storage.");
}

function log(type, msg) {
    switch(type){
        case "error":
            console.error(`[ERROR] -> ${msg}`);
            break;
        case "success":
            console.log(`[SUCCESS] -> ${msg}`);
            break;
        case "info":
            console.info(`[INFO] -> ${msg}`);
            break;
        case "warning":
            console.warn(`[WARNING] -> ${msg}`);
            break;
    }
}

function updateCashVisualizer() {
    cashVisualizer.innerText = totalCash;
    log("info", "Updated cash visualizer to cash value");
}

function handleBatchClick() {
    clicks++;
    manageCash("inc");

    if (clicks >= BATCH_SIZE) {
        sendBatchToServer();
    }
}

function sendBatchToServer() {
    const payload = {
        cash: clicks
    };

    fetch('http://localhost:8080/api/v1/user/save-cash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if(response.ok) {
            clicks = 0;
        } else {
            console.error('Failed to send cash batch to server');
        }
    })
    .catch(error => {
        console.error('Error sending click batch to server:', error);
    });
}

function loadUserInformation() {
    fetchUserDetails()
        .then(({ username, cash }) => {
            log("info", `Retrieved user information: ${username} ${cash}`);
        })
        .catch(error => {
            log("error", `Failed to retrieve user information: ${error.message}`);
        });
}

function fetchUserDetails() {
    return fetch('http://localhost:8080/api/v1/user/details', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to retrieve user information');
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCashVisualizer();

    const upgradeButtons = document.querySelectorAll(".shop .Upgrade_buttons button");
    upgradeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const itemName = button.innerText;
            try {
                buy(sItems[itemName]);
            } catch(err) {
                log("error", err);
            }
        });
    });

    document.getElementById("clicker").addEventListener("click", handleBatchClick);
    
    validateAuthentication()
        .then(isAuthorized => {
            if (isAuthorized) {
                loadUserInformation();
            }
        })
        .catch(error => {
            console.error("Authentication validation error:", error);
        });
});

export { log, getCash, manageCash };
