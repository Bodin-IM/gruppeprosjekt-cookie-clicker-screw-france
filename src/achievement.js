import { getCash } from './main.js';
import { createAchievementNotification } from './notification.js';
import { itemsBought } from './store.js';

const achievements = {
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
            "message": "You clicked 5 times or over in 10 seconds!",
            "end_after": 10000,
            "goal": 5
        },
        "Flash": {
            "message": "You clicked 100 times in a single minute!",
            "end_after": 60000,
            "goal": 100
        }
    }
};

/* Empty list that will hold all collected achievements */
let collectedAchievements = [];

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

function handleClickAchievement() {
    for(const achievement in achievements['click']) {
        const goal = achievements['click'][achievement]['goal'];
        const cash = getCash();

        if (cash >= goal && !collectedAchievements.includes(achievement)) {
            if(localStorage.getItem("achievements") && localStorage.getItem("achievements").includes(achievement)) {
                collectedAchievements.push(achievement);
                return;
            }

            collect('click', achievement);
        }
    }
}

function handleBuyAchievement() {
    for(const achievement in achievements['buy']) {
        const goal = achievements['buy'][achievement]['goal'];

        if(itemsBought >= goal && !collectedAchievements.includes(achievement)) {
            if(localStorage.getItem("achievements") && localStorage.getItem("achievements").includes(achievement)) {
                collectedAchievements.push(achievement);
                return;
            }

            collect('buy', achievement);
        }
    }
}

let timestampClicks = [];
function handleTimeAchievement() {
    function checkOldClicks() {
        for(let i = timestampClicks.length - 1; i >= 0; i--) {
            const click = timestampClicks[i];

            for(const achievement in achievements['time']) {
                const end = achievements['time'][achievement]['end_after'];

                if(Date.now() - click >= end) {
                    
                }
            }
        }
    }

    timestampClicks.push(Date.now());
    console.log(timestampClicks);
    checkOldClicks();
    console.log(timestampClicks);
}

/* Collects specified achievement by pushing to collectedAchievements and adding to localStorage */
function collect(type, achievement) {
    collectedAchievements.push(achievement);
    localStorage.setItem("achievements", collectedAchievements.toString());

    createAchievementNotification(achievement, achievements[type][achievement]["message"]);
}

export { check };
