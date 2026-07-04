// ===============================
// PUB CRAWL CHALLENGE
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyBOXgD_ed-VRx6BjWKrQEM-9I-4fos2Wfk",
  authDomain: "isa-pub-crawl.firebaseapp.com",
  databaseURL: "https://isa-pub-crawl-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "isa-pub-crawl",
  storageBucket: "isa-pub-crawl.firebasestorage.app",
  messagingSenderId: "611740058195",
  appId: "1:611740058195:web:48f4e3869f137653cd3ca6",
  measurementId: "G-P3NQYQMNLS"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// ---------- Identity (per-device, kept in localStorage so a refresh doesn't lose your spot) ----------

let playerId = localStorage.getItem("pubcrawl_id");
if (!playerId) {
  playerId = "p_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("pubcrawl_id", playerId);
}

let player = { name: "", points: 0, drinks: 0, completed: {} };
let allPlayers = {};

// UI state — tracked explicitly instead of read off DOM classes, so switching
// panels and switching difficulty never interfere with each other.
let currentMainTab = "challenges";
let currentLevel = "easy";

// ---------- Elements ----------

const landing = document.getElementById("landing");
const app = document.getElementById("app");

const startBtn = document.getElementById("startBtn");
const playerName = document.getElementById("playerName");

const welcome = document.getElementById("welcome");
const pointsEl = document.getElementById("points");
const drinksEl = document.getElementById("drinks");
const progressEl = document.getElementById("progress");

const challengeList = document.getElementById("challengeList");
const leaderboardList = document.getElementById("leaderboardList");
const drinksBigEl = document.getElementById("drinksBig");

const challengesPanel = document.getElementById("challengesPanel");
const leaderboardPanel = document.getElementById("leaderboardPanel");
const drinksPanel = document.getElementById("drinksPanel");

const plusDrink = document.getElementById("plusDrink");
const minusDrink = document.getElementById("minusDrink");

const randomBtn = document.getElementById("randomChallenge");

// ---------- Start ----------

const savedName = localStorage.getItem("pubcrawl_name");
if (savedName) {
  player.name = savedName;
  showApp();
}

startBtn.addEventListener("click", () => {
  const name = playerName.value.trim();
  if (name === "") {
    alert("Enter your name!");
    return;
  }
  player.name = name;
  localStorage.setItem("pubcrawl_name", name);
  db.ref("players/" + playerId).update({ name, points: 0, drinks: 0 });
  showApp();
});

// ---------- Show App ----------

function showApp() {
  landing.classList.add("hidden");
  app.classList.remove("hidden");
  welcome.innerHTML = `Hi, ${escapeHtml(player.name)} 👋`;
  loadChallenges(currentLevel);
  listenToPlayers();
}

// ---------- Live shared data ----------

function listenToPlayers() {
  db.ref("players").on("value", (snap) => {
    allPlayers = snap.val() || {};
    const me = allPlayers[playerId];
    if (me) {
      player.points = me.points || 0;
      player.drinks = me.drinks || 0;
      player.completed = me.completed || {};
    }
    updateStats();
    renderActivePanel();
  });
}

function renderActivePanel() {
  if (currentMainTab === "challenges") {
    loadChallenges(currentLevel);
  } else if (currentMainTab === "leaderboard") {
    renderLeaderboard();
  }
  // drinks panel just reads updateStats() output, nothing extra to render
}

// ---------- Top-level tabs (Challenges / Leaderboard / Drinks) ----------

document.querySelectorAll(".main-tabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".main-tabs .tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    currentMainTab = tab.dataset.tab;

    challengesPanel.classList.add("hidden");
    leaderboardPanel.classList.add("hidden");
    drinksPanel.classList.add("hidden");

    if (currentMainTab === "challenges") {
      challengesPanel.classList.remove("hidden");
      loadChallenges(currentLevel);
    } else if (currentMainTab === "leaderboard") {
      leaderboardPanel.classList.remove("hidden");
      renderLeaderboard();
    } else if (currentMainTab === "drinks") {
      drinksPanel.classList.remove("hidden");
    }
  });
});

// ---------- Difficulty sub-tabs (inside Challenges panel) ----------

document.querySelectorAll(".sub-tabs .subtab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".sub-tabs .subtab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentLevel = tab.dataset.level;
    loadChallenges(currentLevel);
  });
});

// ---------- Challenges ----------

function loadChallenges(type) {
  challengeList.innerHTML = "";

  challenges
    .filter((c) => c.category === type)
    .forEach((challenge) => {
      const done = !!player.completed[challenge.id];

      const card = document.createElement("div");
      card.className = "challenge" + (done ? " completed" : "");

      card.innerHTML = `
        <div>
          <h4>${escapeHtml(challenge.text)}</h4>
          <small>${challenge.points} Point${challenge.points > 1 ? "s" : ""}</small>
        </div>
        <button>${done ? "Completed ✓" : "Complete"}</button>
      `;

      if (!done) {
        card.querySelector("button").onclick = () => completeChallenge(challenge);
      }

      challengeList.appendChild(card);
    });
}

function completeChallenge(challenge) {
  const updates = {};
  updates["players/" + playerId + "/completed/" + challenge.id] = true;
  updates["players/" + playerId + "/points"] = (player.points || 0) + challenge.points;
  updates["players/" + playerId + "/name"] = player.name;
  db.ref().update(updates);
}

// ---------- Leaderboard ----------

function renderLeaderboard() {
  const rows = Object.entries(allPlayers)
    .map(([id, p]) => ({
      id,
      name: p.name || "???",
      points: p.points || 0,
      completedCount: p.completed ? Object.keys(p.completed).length : 0
    }))
    .sort((a, b) => b.points - a.points);

  if (rows.length === 0) {
    leaderboardList.innerHTML = `<p class="lb-empty">No players yet — be the first to score!</p>`;
    return;
  }

  leaderboardList.innerHTML = rows
    .map(
      (p, i) => `
      <div class="lb-row ${p.id === playerId ? "me" : ""}">
        <span class="lb-rank">#${i + 1}</span>
        <span class="lb-name">${escapeHtml(p.name)}${p.id === playerId ? " (you)" : ""}</span>
        <span class="lb-points">${p.points} pts</span>
      </div>
    `
    )
    .join("");
}

// ---------- Drinks ----------

plusDrink.onclick = () => {
  db.ref("players/" + playerId + "/drinks").transaction((cur) => (cur || 0) + 1);
};

minusDrink.onclick = () => {
  db.ref("players/" + playerId + "/drinks").transaction((cur) => Math.max((cur || 0) - 1, 0));
};

// ---------- Stats ----------

function updateStats() {
  pointsEl.innerText = player.points;
  drinksEl.innerText = player.drinks;
  progressEl.innerText = `${Object.keys(player.completed).length}/30`;
  if (drinksBigEl) drinksBigEl.innerText = player.drinks;
}

// ---------- Random Challenge ----------

randomBtn.onclick = () => {
  const unfinished = challenges.filter(
    (c) => c.category === currentLevel && !player.completed[c.id]
  );

  if (unfinished.length === 0) {
    alert("🎉 You completed every challenge in this category!");
    return;
  }

  const random = unfinished[Math.floor(Math.random() * unfinished.length)];
  alert("🎲 Your random challenge:\n\n" + random.text);
};

// ---------- Utils ----------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}
