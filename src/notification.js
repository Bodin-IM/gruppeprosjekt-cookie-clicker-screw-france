const notifications = document.getElementById("notifications");

window.addEventListener("DOMContentLoaded", () => {
    notifications.addEventListener("click", e => {
        if (e.target.classList.contains("fa-xmark")) {
            let notification = e.target.closest('.notification');
            if (notification) {
                notifications.removeChild(notification);
            }
        }
    });

    notifications.addEventListener("animationend", e => {
        if(e.target.classList.contains("notification")) {
            e.target.remove();
        }
    });
});

function createAchievementNotification(title, goal, message) {
    let audio = new Audio('sfx/achievement.mp3');

    let notification = document.createElement("div");
    notification.classList.add("notification");

    notification.innerHTML = `
    <span><i class="fa-solid fa-trophy"></i></span>
    <div id="message">
        <h3 class="title"><strong>${title}</strong> achievement unlocked!</h3>
        <p class="msg">${message} (${goal} clicks)</p>
    </div>
    <div class="close-btn" id="closeBtn">
        <span><i class="fa-solid fa-xmark"></i></span>
    </div>
    `;

    audio.play();
    notifications.appendChild(notification);
}

export { createAchievementNotification };
