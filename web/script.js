const mealForm = document.getElementById("mealForm");
const burnForm = document.getElementById("burnForm");

const dailyTotalElem = document.getElementById("dailyTotal");
const netCaloriesElem = document.getElementById("netCalories");
const progressElem = document.getElementById("progressMessage");
const messageElem = document.getElementById("message");
const burnMessageElem = document.getElementById("burnMessage");
const weeklySummaryElem = document.getElementById("weeklySummary");

// --- Add Meal ---
mealForm.addEventListener("submit", function(event){
event.preventDefault();


const name = document.getElementById("mealName").value;
const calories = parseInt(document.getElementById("calories").value);
const mealType = document.getElementById("mealType").value;

window.pywebview.api.add_meal(name, calories, mealType).then(response => {
    messageElem.innerText = response;
    mealForm.reset();

    updateAll();
});


});

// --- Add Burned Calories ---
burnForm.addEventListener("submit", function(event){
event.preventDefault();


const activity = document.getElementById("activity").value;
const calories = parseInt(document.getElementById("burnCalories").value);

window.pywebview.api.add_burned(activity, calories).then(response => {
    burnMessageElem.innerText = response;
    burnForm.reset();

    updateAll();
});


});

// --- Update Daily Total ---
function updateDailyTotal() {
window.pywebview.api.get_daily_total().then(total => {
dailyTotalElem.innerText = total;
});
}

// --- Update Net Calories ---
function updateNetCalories() {
window.pywebview.api.get_net_calories().then(net => {
netCaloriesElem.innerText = net;


    window.pywebview.api.get_daily_goal().then(goal => {
        if (net < goal) {
            netCaloriesElem.style.color = "green";
        } else if (net === goal) {
            netCaloriesElem.style.color = "orange";
        } else {
            netCaloriesElem.style.color = "red";
        }
    });
});


}

// --- Update Progress Message ---
function updateProgress() {
window.pywebview.api.get_progress().then(message => {
progressElem.innerText = message;


    if (message.includes("on track")) {
        progressElem.style.color = "green";
    } else if (message.includes("Perfect")) {
        progressElem.style.color = "orange";
    } else if (message.includes("Too much")) {
        progressElem.style.color = "red";
    } else {
        progressElem.style.color = "black";
    }
});


}

// --- Update Weekly Summary ---
function updateWeeklySummary() {
window.pywebview.api.get_weekly_summary().then(summary => {
weeklySummaryElem.innerHTML = "";


    summary.forEach(day => {
        const li = document.createElement("li");
        li.innerText = `${day.date}: ${day.net_calories} kcal`;

        if (day.net_calories < 1800) {
            li.style.color = "green";
        } else if (day.net_calories === 1800) {
            li.style.color = "orange";
        } else {
            li.style.color = "red";
        }

        weeklySummaryElem.appendChild(li);
    });
});


}

// --- Update Everything ---
function updateAll() {
    updateDailyTotal();
    updateNetCalories();
    updateProgress();
    updateWeeklySummary();
}

// --- Initial Page Load ---
updateAll();



const chatToggle = document.getElementById("chatToggle");
const chatWindow = document.getElementById("chatWindow");

chatToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
});
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatOutput = document.getElementById("chatOutput");

function appendMessage(sender, text) {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatOutput.appendChild(p);
    chatOutput.scrollTop = chatOutput.scrollHeight; // auto scroll
}

sendBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("You", message);  // show user's message
    chatInput.value = "";           // clear input

    // Call Python AI bot
    window.pywebview.api.chat_bot(message).then(response => {
        appendMessage("AI", response);
    });
});

// Also allow pressing Enter to send
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});
