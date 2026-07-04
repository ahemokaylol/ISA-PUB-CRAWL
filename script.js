// ===============================
// PUB CRAWL CHALLENGE
// ===============================

// ---------- Challenge List ----------

const challenges = {
    easy: [
        "Photobomb someone",
        "Take a selfie with the drunkest person you see",
        "Record a TikTok/Reel and post it",
        "Beat a stranger at Rock-Paper-Scissors",
        "Compliment a stranger's outfit and take a photo",
        "Ask someone how to say 'Cheers' in their language",
        "Convince a stranger you're from another nationality",
        "Ask a stranger to recommend your next drink",
        "Sit at a random table like you're part of the group",
        "Ask someone what your vibe is"
    ],

    medium: [
        "Serenade a stranger",
        "Win a chug competition",
        "Order a drink in the weirdest accent possible",
        "Ask for a lighter, then pretend to be a monkey",
        "Dance the Macarena with 3 strangers",
        "Start a conga line",
        "Fake-propose to a stranger",
        "Pose with a stranger like you're on a movie poster",
        "Challenge a stranger to a 5-second dance battle",
        "Get a stranger to give you a motivational speech"
    ],

    hard: [
        "Get a free drink",
        "Convince strangers to chant 'MVP! MVP! MVP!'",
        "Win an arm-wrestling match",
        "Start a dance circle with strangers",
        "Convince someone to carry you for a photo",
        "Recreate a famous movie scene",
        "Get 5 strangers to do the same pose",
        "Pretend to be long-lost cousins with a stranger",
        "Create a secret handshake with a stranger",
        "Get a bartender to invent a drink name for you"
    ]
};

// ---------- Points ----------

const pointValues = {
    easy: 1,
    medium: 3,
    hard: 5
};

// ---------- Storage ----------

let player = JSON.parse(localStorage.getItem("pubcrawl"));

if (!player) {

    player = {
        name: "",
        points: 0,
        drinks: 0,
        completed: []
    };

}

// ---------- Elements ----------

const landing = document.getElementById("landing");
const app = document.getElementById("app");

const startBtn = document.getElementById("startBtn");
const playerName = document.getElementById("playerName");

const welcome = document.getElementById("welcome");
const points = document.getElementById("points");
const drinks = document.getElementById("drinks");
const progress = document.getElementById("progress");

const challengeList = document.getElementById("challengeList");

const plusDrink = document.getElementById("plusDrink");
const minusDrink = document.getElementById("minusDrink");

const randomBtn = document.getElementById("randomChallenge");

// ---------- Start ----------

if (player.name !== "") {

    showApp();

}

startBtn.addEventListener("click", () => {

    const name = playerName.value.trim();

    if (name === "") {

        alert("Enter your name!");

        return;

    }

    player.name = name;

    save();

    showApp();

});

// ---------- Show App ----------

function showApp() {

    landing.classList.add("hidden");

    app.classList.remove("hidden");

    welcome.innerHTML = `Hi, ${player.name} 👋`;

    loadChallenges("easy");

    updateStats();

}

// ---------- Tabs ----------

document.querySelectorAll(".tab").forEach(tab => {

    tab.addEventListener("click", () => {

        document.querySelectorAll(".tab").forEach(t =>
            t.classList.remove("active")
        );

        tab.classList.add("active");

        loadChallenges(tab.dataset.tab);

    });

});

// ---------- Challenges ----------

function loadChallenges(type) {

    challengeList.innerHTML = "";

    challenges[type].forEach((challenge, index) => {

        const id = type + index;

        const card = document.createElement("div");

        card.className = "challenge";

        if (player.completed.includes(id)) {

            card.classList.add("completed");

        }

        card.innerHTML = `

            <div>

                <h4>${challenge}</h4>

                <small>${pointValues[type]} Point${pointValues[type] > 1 ? "s" : ""}</small>

            </div>

            <button>

                ${player.completed.includes(id) ? "Completed ✓" : "Complete"}

            </button>

        `;

        const button = card.querySelector("button");

        if (!player.completed.includes(id)) {

            button.onclick = () => {

                player.completed.push(id);

                player.points += pointValues[type];

                save();

                loadChallenges(type);

                updateStats();

            };

        }

        challengeList.appendChild(card);

    });

}

// ---------- Drinks ----------

plusDrink.onclick = () => {

    player.drinks++;

    save();

    updateStats();

};

minusDrink.onclick = () => {

    if (player.drinks > 0) {

        player.drinks--;

    }

    save();

    updateStats();

};

// ---------- Stats ----------

function updateStats() {

    points.innerText = player.points;

    drinks.innerText = player.drinks;

    progress.innerText = `${player.completed.length}/30`;

}

// ---------- Random Challenge ----------

randomBtn.onclick = () => {

    const currentTab = document.querySelector(".tab.active").dataset.tab;

    const unfinished = [];

    challenges[currentTab].forEach((challenge, index) => {

        const id = currentTab + index;

        if (!player.completed.includes(id)) {

            unfinished.push(challenge);

        }

    });

    if (unfinished.length === 0) {

        alert("🎉 You completed every challenge in this category!");

        return;

    }

    const random = unfinished[Math.floor(Math.random() * unfinished.length)];

    alert("🎲 Your random challenge:\n\n" + random);

};

// ---------- Save ----------

function save() {

    localStorage.setItem("pubcrawl", JSON.stringify(player));

}
