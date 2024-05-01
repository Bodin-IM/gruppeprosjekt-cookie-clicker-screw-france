const notifications = document.getElementById("notifications");

window.addEventListener("DOMContentLoaded", () => {
    /*
     * Click event listener for notifications div 
     * Adds functionality to the notification's close button
    */
    notifications.addEventListener("click", e => {
        if (e.target.classList.contains("fa-xmark")) {
            let notification = e.target.closest('.notification');
            if (notification) {
                notifications.removeChild(notification);
            }
        }
    });

    /* Listens for the end of the fadeOut animation; when it ends, remove the notification */
    notifications.addEventListener("animationend", e => {
        if(e.target.classList.contains("notification")) {
            e.target.remove();
        }
    });
});

/* Creates the notification HTML code and plays a sound on display */
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
