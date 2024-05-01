import { getCash, log } from './main.js';
import { createAchievementNotification } from './notification.js';

const clickAchievements = {
    "Beginner": {
        "message": "You've just started your clicking journey!",
        "goal": 10
    },
    "Clicker": {
        "message": "You're clicking your way to success!",
        "goal": 100
    },
    "Advanced": {
        "message": "Your clicking skills are improving!",
        "goal": 500
    },
    "Professional": {
        "message": "You're a clicking pro now!",
        "goal": 1000
    },
    "World-champion": {
        "message": "You're among the best clickers in the world!",
        "goal": 5000
    },
    "God": {
        "message": "You've reached clicking divinity!",
        "goal": 10000
    }
};

/* Empty list that will hold all collected achievements*/
let collectedAchievements = [];

/* Checks whether or not the user has reached an achievement,if they have, collect it.  */
function check() {
    for(const achievement in clickAchievements) {
        const goal = clickAchievements[achievement]["goal"];
        const cash = getCash();

        if (cash >= goal && !collectedAchievements.includes(achievement)) {
            if(localStorage.getItem("achievements") && localStorage.getItem("achievements").includes(achievement)) {
                collectedAchievements.push(achievement);
                return;
            }

            collect(achievement);
        }
    }
}

/* Collects specified achievement by pushing to collectedAchievements and adding to localStorage */
function collect(achievement) {
    collectedAchievements.push(achievement);
    localStorage.setItem("achievements", collectedAchievements.toString());

    createAchievementNotification(achievement, clickAchievements[achievement]["goal"], clickAchievements[achievement]["message"]);
}

export { check };
