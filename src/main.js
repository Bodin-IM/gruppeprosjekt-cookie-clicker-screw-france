/*
 ----- VIKTIG INFORMASJON -----

 Backend serveren er imidlertidig hosted lokalt, innloggning eller registrering vil ikke funke
 Dette betyr at hvis du prøver å gå på siden, vil du bli omdirigert til login siden

 For å unngå dette, må man skru på en boolean som heter "DevMode", dette vil få nettsiden til å unngå
 all kommunikasjon til serveren og informasjon vil da lagres lokalt istedenfor i databasen
*/

import { buy, sItems } from "./store.js";
import { validateAuthentication } from "./auth.js";
import { check } from "./achievement.js";

const cashVisualizer = document.getElementById("cash");
const usernameVisualizer = document.getElementById("username");

var totalCash = localStorage.getItem("cash") || 0;

const BATCH_SIZE = 20;
let clicks = 0;

/* GJØR DENNE TIL TRUE */
let devMode = false;

/* Unødvendig funksjon, getters er ikke nødvending i JS */
function getCash() {
    return totalCash;
}

/*
 * Denne funksjonen brukes til å "administrere" brukerens cash
 * "INC" betyr 'Increment', som vil inkremere med 1 hver gang
 * "DEC" betyr 'Decrease', som vil forminske med 1 hver gang
 * "SET" kan man bruke for å sette totalCash til et bestemt tall
*/
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

    if(devMode) {
        storeCash(totalCash);
    }
}

/*
 * Lagrer "cash" i local-storage    (F12 -> Storage -> Local Storage)
*/
function storeCash(cash) {
    localStorage.setItem("cash", cash);
    log("success", "Stored user cash value to local storage.");
}

/*
 * Denne funksjonen brukes bare til debugging
 * Det er egentlig bare console.log men med formatting.
*/
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
        default:
            console.log(`[${type.toUpperCase()}] -> ${msg}`);
            break;
    }
}


/* Oppdaterer cashVisualizer (h1-taggen som sier Cash:) til totalCash */
function updateCashVisualizer() {
    cashVisualizer.innerText = totalCash;
    log("info", "Updated cash visualizer to cash value");
}

/*
 * Denne funksjonen brukes for onclick event i DOMContentLoaded
*/
function handleBatchClick() {
    clicks++;
    
    manageCash("inc");
    check();
/*
    if(!devMode) {
        if (clicks >= BATCH_SIZE) {
            sendBatchToServer();
        }
    }
    */
}

/*
 * sendBatchToServer funksjonen sender en POST request til API-endepunktet "save-cash"
 * Her sender vi et payload som forteller API'en hvor mange ganger vi har klikket
 * Hvis svaret til API'en er ok (http status kode: 2xx) - da resetter vi hvor mange ganger vi har klikket.
 * API'en vil til slutt oppdatere brukerens cash i databasen
*/
function sendBatchToServer() {
    const payload = {
        cash: clicks
    };

    fetch('http://10.100.0.62:8080/api/v1/user/save-cash', {
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
            log("info", "Sent batch to server.")
        } else {
            console.error('Failed to send cash batch to server');
        }
    })
    .catch(error => {
        console.error('Error sending click batch to server:', error);
    });
}

/*
 * Henter brukerdetaljer og oppdaterer UI'en med informasjonen vi hentet
 * Hvis "cash" er null, setter du den til 0 sånn at det ser bra ut på UI'en 
*/
function loadUserInformation() {
    fetchUserDetails()
        .then(({ username, cash }) => {
            log("info", `Retrieved user information: ${username} ${cash}`);

            if (cash == null) {
                cash = 0;
            }

            manageCash("set", cash);
            storeCash(cash);

            usernameVisualizer.innerText = username;
        })
        .catch(error => {
            log("error", `Failed to retrieve user information: ${error.message}`);
        });
}
/*
 * En funksjon hvor vi sender en GET request til API-endepunktet api/v1/user/details
 * Hvis API'en svarer med brukerinformasjonen da returnerer vi svaret som JSON
*/
function fetchUserDetails() {
    return fetch('http://10.100.0.62:8080/api/v1/user/details', {
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

/* En funksjon som kan brukes for å kjapt lagre hvor mye cash brukeren har. */
function save() {
    sendBatchToServer();
    log("info", "Saved.");
}

document.addEventListener("DOMContentLoaded", () => {
    // Oppdaterer visualizer først
    updateCashVisualizer();

    /*
     * Hvert andre minutt skal cash lagres til database
     * 120000 MS = 2.0 MIN
    */
    setInterval(() => {
        sendBatchToServer();
        log("info", "Auto-saved.");
    }, 120000);

    const upgradeButtons = document.querySelectorAll(".shop .Upgrade_buttons button");

    /*
     * Hver upgrade knapp får sin egen click event listener
     * Etter dette, får vi navnet til hver knapp (itemName variabel)
     * Til slutt prøver vi å kjøpe det fra sItems listen med itemName som key
    */
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
    document.getElementById("save").addEventListener("click", () => {
        save();
    });
    document.getElementById("logout").addEventListener("click", () => {
        save();

        // Fjern keys fra local storage
        localStorage.removeItem("token");
        localStorage.removeItem("cash")

        // Redirect til login side
        window.location.href = "login.html";
    });
    

    // Hvis devMode variabelen er "true"
    if(devMode) {
        // Sett brukernavnet til "DEV-MODE"
        usernameVisualizer.innerText = 'DEV-MODE';

        // Fjern token fra local storage i tilfelle den eksisterer
        localStorage.removeItem("token");
    } else { 
        /*
         * validateAuthentication er en funksjon som verifiserer JWT-tokens for å sjekke om de er expired eller tuklet med
        */
        validateAuthentication()
            .then(isAuthorized => {
                // Hvis token er OK
                if (isAuthorized) {
                    // Load bruker informasjon
                    loadUserInformation();
                } else { // Hvis token ikke er OK (enten tuklet med eller expired)
                    // Fjern token fra local storage
                    localStorage.removeItem("token");

                    // Redirect til login siden for nytt forsøk
                    window.location.href = "login.html";
                }
            })
            .catch(error => {
                console.error("Authentication validation error:", error);
            });
    }
});

export { log, getCash, manageCash };
