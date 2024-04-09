import { log, getCash, manageCash } from "./main.js";

let inventory = [];

// Her kan man forandre "prisene" til oppgraderingene og legge til items
const sItems = {
    "Mouse": 10,
    "Auto click": 20,
    "Homeless guy": 30,
    "Case": 40,
    "Motherboard": 50,
    "RAM": 60,
    "Cpu": 70,
    "Cpu cooler": 80,
    "Graphics card": 90,
    "Psu": 100,
    "Complete pc": 110,
    "Bird thing": 361
};

function buy(item) {
    if(canAfford(item) && !inventory.includes(getKeyByValue(sItems, item))) {
        var preBalance = getCash();

        manageCash("set", getCash() - item);
        log("success", `User can afford item '${getKeyByValue(sItems, item)}'\nPre-balance: ${preBalance} | Post-balance: ${getCash()}\nDiff: ${preBalance - getCash()}`);

        inventory.push(getKeyByValue(sItems, item));
        log("info", `Pushed ${getKeyByValue(sItems, item)} to user inventory`);
    } else {
        log("error", "User has insufficient funds.");
    }
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

export { inventory, sItems, buy };
