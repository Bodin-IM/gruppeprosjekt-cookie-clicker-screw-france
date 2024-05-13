import { getCash, log } from './main.js';
import { createAchievementNotification } from './notification.js';
import { itemsBought } from './store.js';

let achievements = {
    "click": {
        "Beginner": {
            "message": "You've just started your clicking journey! (10 clicks)",
            "goal": 10
        },
        "Clicker": {
            "message": "You're clicking your way to success! (100 clicks)",
            "goal": 100
        },
        "Advanced": {
            "message": "Your clicking skills are improving! (500 clicks)",
            "goal": 500
        },
        "Professional": {
            "message": "You're a clicking pro now! (1000 clicks)",
            "goal": 1000
        },
        "World-champion": {
            "message": "You're among the best clickers in the world! (5000 clicks)",
            "goal": 5000
        },
        "God": {
            "message": "You've reached clicking divinity! (10000 clicks)",
            "goal": 10000
        }
    },
    "buy": {
        "Brokie": {
            "message": "You bought your first item!",
            "goal": 1
        },
        "Savvy Shopper": {
            "message": "You've made 10 wise purchases!",
            "goal": 10
        }
    },
    "time": {
        "Test": {
            "name": "Test",
            "message": "You clicked 5 times or over in 10 seconds!",
            "end_after": 10000,
            "goal": 5
        },
        "Flash": {
            "name": "Flash",
            "message": "You clicked 100 times in a single minute!",
            "end_after": 60000,
            "goal": 100
        }
    }
};
globalThis.achievements = achievements;

/* Empty list that will hold all collected achievements */
let collectedAchievements = {
    "click": {

    },
    "buy": {

    },
    "time": {

    }
};
globalThis.collectedAchievements = collectedAchievements;

document.addEventListener("DOMContentLoaded", updateCollectedAchievements());

/* Checks whether or not the user has reached an achievement, if they have, collect it.  */
function check(type) {
    switch(type) {
        case 'click':
            handleClickAchievement();
            break;
        case 'buy':
            handleBuyAchievement();
            break;
        case 'time':
            handleTimeAchievement();
            break;
    }
}

function updateCollectedAchievements() {
    const storedAchievements = localStorage.getItem("achievements");
    const parsedAchievements = JSON.parse(storedAchievements);

    for(const key in parsedAchievements) {
        for(const achievement in parsedAchievements[key]) {
            collectedAchievements[key][achievement] = achievements[key][achievement];
            delete achievements[key][achievement];
        }
    }
}

function isAchievementPreviouslyCollected(type, achievement) {
    const storedAchievements = localStorage.getItem("achievements");

    if(storedAchievements) {
        try {
            const parsedAchievements = JSON.parse(storedAchievements);

            if(parsedAchievements[type] && parsedAchievements[type][achievement]) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            log("warning", "Error parsing stored achievements:", error);
            return false;
        }
    }

    return false;
}

function handleClickAchievement() {
    for(const achievement in achievements['click']) {
        const goal = achievements['click'][achievement]['goal'];
        const cash = getCash();

        if (cash >= goal  && !collectedAchievements['click'][achievement]) {
            collect('click', achievement);
        }
    }
}

function handleBuyAchievement() {
    for(const achievement in achievements['buy']) {
        const goal = achievements['buy'][achievement]['goal'];

        if(itemsBought >= goal && !collectedAchievements['buy'][achievement]) {
            collect('buy', achievement);
        }
    }
}

let timestampClicks = [];
function handleTimeAchievement() {
    function sort() {
        return Object.values(achievements.time).sort((a, b) => a.end_after - b.end_after);
    }

    const sortedAchievements = sort();
    const achievement = sortedAchievements[0];

    console.log(achievements.time);
    console.log(sortedAchievements);

    timestampClicks.push({ timestamp: new Date().getTime() });
    timestampClicks = timestampClicks.filter(obj => {
        const timestamp = obj.timestamp;
        const currentTime = new Date().getTime();

        return currentTime - timestamp < achievement.end_after;
    });

    if (timestampClicks.length >= achievement.goal && !collectedAchievements['time'][achievement]) {
        collect('time', achievement.name);
    }
}

/* Collects specified achievement by pushing to collectedAchievements and adding to localStorage */
function collect(type, achievement) {
    if(isAchievementPreviouslyCollected(type, achievement)) {
        collectedAchievements[type][achievement] = achievements[type][achievement];
        delete achievements[type][achievement];
        return;
    }

    collectedAchievements[type][achievement] = achievements[type][achievement];
    delete achievements[type][achievement];

    localStorage.setItem("achievements", JSON.stringify(collectedAchievements));

    createAchievementNotification(achievement, collectedAchievements[type][achievement]["message"]);
}

export { check };
