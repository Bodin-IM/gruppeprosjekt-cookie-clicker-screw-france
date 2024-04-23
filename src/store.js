import { log, getCash, manageCash } from "./main.js";

/*
 * Aquí puede cambiar el precio de los artículos -
 * - este sistema es malo porque si 2 artículos tienen el mismo precio, el sistema se romperá (Yo creo)
*/
/*
* Se corrigieron algunos de los precios debido a cómo funciona la escala (la actualización aumenta el precio cada vez que se compran)
* - y agregué algunas de las otras actualizaciones que aún no se muestran en este script.
* - Quería que los precios de las actualizaciones aumentaran entre un 10% y un 50% cada vez que se compraran.
*/
const sItems = {
    "Mouse": 1,
    "Auto click": 10,
    "Homeless guy": 50,
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
    "Black Hole Generator": 8800000,
    "Time Machine": 3210000,
    "Dimentional Gate": 100000000,
    "Parallel Universes": 500000000,
    "VOID": 1000000000,
    "Jerald": 6666666666,


};

let inventory = [];

function getInventory() {
  return inventory;
}

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
