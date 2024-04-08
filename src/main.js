/*
 * 
 *
 * 
*/

document.addEventListener("DOMContentLoaded", () => {
    // Variables
    const clickerObject = document.getElementById("click");
    const cashVisualizer = document.getElementById("cash");

    let totalCash = localStorage.getItem("cash");
    
    function onObjectClick() {
        manageCash("inc");
        console.log(totalCash);

        storeData();
    }

    function storeData() {
        localStorage.setItem("cash", totalCash);
        log("info", "Stored user cash value to local storage.")
    }

    function manageCash(type, arg){
        arg = arg || 0

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
    }

    function log(type, msg) {
        switch(type){
            case "error":
                console.log(`[ERROR] -> ${msg}`);
                break;
            case "info":
                console.log(`[INFO] -> ${msg}`);
                break;
            case "warning":
                console.log(`[WARNING] -> ${msg}`);
                break;
        }
    }

    function load(){
        cashVisualizer.innerText = totalCash;
    }

    // Listeners
    clickerObject.addEventListener("click", onObjectClick);

    load();
});