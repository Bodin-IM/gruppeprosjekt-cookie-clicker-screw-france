import { check } from "./achievement.js";
import { log, getCash, manageCash } from "./main.js";

// Dictionary som inneholder alle butikk-items
const sItems = {
    "Cursor": 10,
    "Auto click": 25,
    "Homeless guy": 100,
    "Case": 250,
    "Motherboard": 550,
    "RAM": 1500,
    "Cpu": 4000,
    "Cpu cooler": 12500,
    "Graphics card": 50000,
    "Psu": 140000,
    "Complete pc": 210000,
    "Bird thing": 350000,
    "Satelite": 500000,
    "Rover": 1000000,
    "Dyson Sphere": 4200000,
    "Black Hole Generator": 58000000,
    "Time Machine": 321000000,
    "Dimentional Gate": 374000000,
    "Parallel Universes": 1200000000,
    "V01D": 10000000000,
    "Jerald": 66666666666,


};

// Brukerens inventory
let inventory = [];
let itemsBought = 0;

function getInventory() {
  return inventory;
}

/* En funksjon brukt for å kjøpe en item */
function buy(item) {
  /* Hvis brukerens inventory allerede inneholder "item" */
  if(getInventory().includes(getKeyByValue(sItems, item))) {
    log("error", "User already owns this upgrade.");
    return;
  }

  /* Hvis brukeren ikke har nok penger */
  if(!canAfford(item)) {
    log("error", "User has insufficient funds.");
    return;
  }

  /* Hvor mye penger brukeren har før kjøpet */
  var preBalance = getCash();

  /* Oppdaterer hvor mye penger brukeren har */
  manageCash("set", getCash() - item);
  log("success", `User can afford item '${getKeyByValue(sItems, item)}'\nPre-balance: ${preBalance} | Post-balance: ${getCash()}\nDiff: ${preBalance - getCash()}`);

  /* "item" blir lagt til i inventory */
  getInventory().push(getKeyByValue(sItems, item));
  log("info", `Pushed ${getKeyByValue(sItems, item)} to user inventory`);
  log("info", getInventory())

  itemsBought++;
  check("buy");
}

/*
 * Denne funksjonen finner navnet til et item via prisen
 * Selvfølgelig er dette et dårlig system fordi hvis 2 ting har samme pris vil det ikke funke.
*/
function getKeyByValue(object, value) {
  /* For alle keys i et objekt/liste */
    for (const key in object) {
      // Sjekk om objektet har den spesifiserte nøkkelen og om verdien knyttet til den nøkkelen matcher den gitte verdien.
      if (object.hasOwnProperty(key) && object[key] === value) {
        return key;
      }
    }
    return undefined;
  }

function canAfford(item) {
    return getCash() >= item;
}

export { sItems, buy, itemsBought };
