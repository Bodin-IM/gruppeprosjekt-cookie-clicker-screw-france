import { getCash, log } from './main.js';

const clickAchievements = {
    "Beginner": 10,
    "Clicker": 100,
    "Advanced": 500,
    "Professional": 1000,
    "World-champion": 5000,
    "God": 10000
};

let collectedAchievements = [];

function check() {
    for(const achievement in clickAchievements) {
        const goal = clickAchievements[achievement];
        const cash = getCash();

        if (cash >= goal && !collectedAchievements.includes(achievement)) {
            collect(achievement);
        }
    }
}

function collect(achievement) {
    collectedAchievements.push(achievement);
    localStorage.setItem("achievements", collectedAchievements.toString());

    log(
        "success",
        `Congratulations! You have unlocked the ${achievement} achievement for ${clickAchievements[achievement]} clicks!`
    );
}

export { check };