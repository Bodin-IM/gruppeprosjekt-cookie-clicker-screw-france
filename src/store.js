import { log, getCash, manageCash } from "./main.js";
import { getInventory } from "./user.js";

/*
 * Aquí puede cambiar el precio de los artículos -
 * - este sistema es malo porque si 2 artículos tienen el mismo precio, el sistema se romperá (Yo creo)
*/
const sItems = {
    "Mouse": 1,
    "Auto click": 10,
    "Homeless guy": 25,
    "Case": 75,
    "Motherboard": 200,
    "RAM": 500,
    "Cpu": 1000,
    "Cpu cooler": 2000,
    "Graphics card": 5000,
    "Psu": 10000,
    "Complete pc": 20000,
    "Bird thing": 50000,
    "Satelite": 100000
};

function buy(item) {
  if(getInventory().includes(getKeyByValue(sItems, item))) {
    log("error", "User already owns this upgrade.");
    return;
  }

  if(!canAfford(item)) {
    log("error", "User has insufficient funds.");
    return;
  }

  var preBalance = getCash();

  manageCash("set", getCash() - item);
  log("success", `User can afford item '${getKeyByValue(sItems, item)}'\nPre-balance: ${preBalance} | Post-balance: ${getCash()}\nDiff: ${preBalance - getCash()}`);

  getInventory().push(getKeyByValue(sItems, item));
  log("info", `Pushed ${getKeyByValue(sItems, item)} to user inventory`);
  log("info", getInventory())
}

function getKeyByValue(object, value) {
    for (const key in object) {
      if (object.hasOwnProperty(key) && object[key] === value) {
        return key;
      }
    }
    return undefined;
  }

function canAfford(item) {
    return getCash() >= item;
}

export { sItems, buy };
