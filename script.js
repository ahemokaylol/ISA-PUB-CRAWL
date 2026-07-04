let players = {};
let currentPlayer = '';

try {
    players = JSON.parse(localStorage.getItem('pubCrawlPlayers')) || {};
    currentPlayer = localStorage.getItem('currentPlayer') || '';
} catch(e) {}

const challenges = [ /* paste your full challenges array here from previous messages */ ];

function saveName() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) return alert("Enter your name");
    currentPlayer = name;
    localStorage.setItem('currentPlayer', name);
    document.getElementById('welcomeMessage').innerHTML = `<h2>Welcome, ${name}!</h2>`;
}

function toggleChallenge(id, completed) {
    if (!currentPlayer) return;
    if (!players[currentPlayer]) players[currentPlayer] = {challenges: {}, drinks: 0};
    if (!players[currentPlayer].challenges) players[currentPlayer].challenges = {};
    players[currentPlayer].challenges[id] = completed;
    localStorage.setItem('pubCrawlPlayers', JSON.stringify(players));
}

function updateDrinks() {
    if (!currentPlayer) return;
    if (!players[currentPlayer]) players[currentPlayer] = {challenges: {}, drinks: 0};
    players[currentPlayer].drinks = parseInt(document.getElementById('drinkCount').value) || 0;
    localStorage.setItem('pubCrawlPlayers', JSON.stringify(players));
}

function calculateScore(playerName) {
    if (!players[playerName] || !players[playerName].challenges) return 0;
    let score = 0;
    Object.keys(players[playerName].challenges).forEach(id => {
        if (players[playerName].challenges[id]) {
            const ch = challenges.find(c => c.id == id);
            if (ch) score += ch.points;
        }
    });
    return score;
}

function submitProgress() {
    if (!currentPlayer) return alert("Enter name first");
    alert("✅ Progress saved!");
    refreshLeaderboard();
}

function refreshLeaderboard() {
    const board = document.getElementById('leaderboard');
    let html = '<table><tr><th>Rank</th><th>Player</th><th>Points</th><th>Drinks</th></tr>';
    const sorted = Object.keys(players)
        .map(name => ({name, score: calculateScore(name), drinks: players[name].drinks || 0}))
        .sort((a, b) => b.score - a.score);
    sorted.forEach((p, i) => html += `<tr><td>${i+1}</td><td>${p.name}</td><td><strong>${p.score}</strong></td><td>${p.drinks}</td></tr>`);
    html += '</table>';
    board.innerHTML = sorted.length ? html : '<p>No players yet.</p>';
}

function showMain() {
    hideAllScreens();
    document.getElementById('homeScreen').classList.add('active');
}

function showChallenges() {
    hideAllScreens();
    document.getElementById('challengesScreen').classList.add('active');
    showPointTab(1); // default to 1pt
}

function showLeaderboard() {
    hideAllScreens();
    document.getElementById('leaderboardScreen').classList.add('active');
    refreshLeaderboard();
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
}

function showPointTab(pt) {
    const container = document.getElementById('pointContent');
    let html = `<div class="points-header">${pt} POINT CHALLENGES</div>`;
    const filtered = challenges.filter(c => c.points === pt);
    filtered.forEach(ch => {
        const checked = (players[currentPlayer] && players[currentPlayer].challenges && players[currentPlayer].challenges[ch.id]) ? 'checked' : '';
        html += `<div class="challenge"><input type="checkbox" ${checked} onchange="toggleChallenge(${ch.id}, this.checked)"><label>${ch.name} (+${ch.points} pts)</label></div>`;
    });
    container.innerHTML = html;
}

// Init
window.onload = () => {
    if (currentPlayer) {
        document.getElementById('playerName').value = currentPlayer;
        document.getElementById('welcomeMessage').innerHTML = `<h2>Welcome, ${currentPlayer}!</h2>`;
    }
};
