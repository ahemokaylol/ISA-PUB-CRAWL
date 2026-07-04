// ===============================
// PUB CRAWL CHALLENGE
// ===============================

// ---------- Challenge List ----------

const challenges = [
  // EASY
  { id: 1, category: "easy", points: 1, text: "Photobomb someone" },
  { id: 2, category: "easy", points: 1, text: "Take a selfie with the drunkest person you see" },
  { id: 3, category: "easy", points: 1, text: "Record a TikTok/Reel and post it" },
  { id: 4, category: "easy", points: 1, text: "Beat a stranger at Rock-Paper-Scissors" },
  { id: 5, category: "easy", points: 1, text: "Compliment a stranger's outfit and take a photo" },
  { id: 6, category: "easy", points: 1, text: "Ask someone how to say 'Cheers' in their language" },
  { id: 7, category: "easy", points: 1, text: "Convince a stranger you're from another nationality" },
  { id: 8, category: "easy", points: 1, text: "Ask a stranger to recommend your next drink" },
  { id: 9, category: "easy", points: 1, text: "Sit at a random table like you're part of the group" },
  { id: 10, category: "easy", points: 1, text: "Ask someone what your vibe is" },

  // MEDIUM
  { id: 11, category: "medium", points: 3, text: "Serenade a stranger" },
  { id: 12, category: "medium", points: 3, text: "Win a chug competition" },
  { id: 13, category: "medium", points: 3, text: "Order a drink in the weirdest accent possible" },
  { id: 14, category: "medium", points: 3, text: "Ask for a lighter, then pretend to be a monkey" },
  { id: 15, category: "medium", points: 3, text: "Dance the Macarena with 3 strangers" },
  { id: 16, category: "medium", points: 3, text: "Start a conga line" },
  { id: 17, category: "medium", points: 3, text: "Fake-propose to a stranger" },
  { id: 18, category: "medium", points: 3, text: "Pose with a stranger like you're on a movie poster" },
  { id: 19, category: "medium", points: 3, text: "Challenge a stranger to a 5-second dance battle" },
  { id: 20, category: "medium", points: 3, text: "Get a stranger to give you a motivational speech" },

  // HARD
  { id: 21, category: "hard", points: 5, text: "Get a free drink" },
  { id: 22, category: "hard", points: 5, text: "Convince strangers to chant 'MVP! MVP! MVP!'" },
  { id: 23, category: "hard", points: 5, text: "Win an arm-wrestling match" },
  { id: 24, category: "hard", points: 5, text: "Start a dance circle with strangers" },
  { id: 25, category: "hard", points: 5, text: "Convince someone to carry you for a photo" },
  { id: 26, category: "hard", points: 5, text: "Recreate a famous movie scene" },
  { id: 27, category: "hard", points: 5, text: "Get 5 strangers to do the same pose" },
  { id: 28, category: "hard", points: 5, text: "Pretend to be long-lost cousins with a stranger" },
  { id: 29, category: "hard", points: 5, text: "Create a secret handshake with a stranger" },
  { id: 30, category: "hard", points: 5, text: "Get a bartender to invent a drink name for you" }
];

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
