import { buy, sItems } from "./store.js"

const cashVisualizer = document.getElementById("cash");
var totalCash = localStorage.getItem("cash");

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

document.addEventListener("DOMContentLoaded", () => {
    const clickerObject = document.getElementById("clicker");

    function onObjectClick() {
        manageCash("inc");

        storeData();
    }

    function load(){
        cashVisualizer.innerText = totalCash;
        log("info", "Updated cash visualizer to cash value");

        // Event Listeners

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

        clickerObject.addEventListener("click", onObjectClick);

        log("info", "Loaded");
    }

    load();
});

export { log, getCash, manageCash };
