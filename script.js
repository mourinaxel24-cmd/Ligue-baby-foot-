let players = JSON.parse(localStorage.getItem('players')) || [];

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
    updateRanking();
    updateSelects();
}

function addPlayer() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) return;
    players.push({name, elo: 1000});
    document.getElementById('playerName').value = '';
    savePlayers();
}

function updateSelects() {
    let selects = [document.getElementById('p1'), document.getElementById('p2')];
    selects.forEach(sel => {
        sel.innerHTML = '';
        players.forEach((p, i) => {
            let opt = document.createElement('option');
            opt.value = i;
            opt.textContent = p.name;
            sel.appendChild(opt);
        });
    });
}

function updateRanking() {
    const table = document.getElementById('ranking');
    table.innerHTML = '<tr><th>Joueur</th><th>ELO</th></tr>';
    players.sort((a, b) => b.elo - a.elo).forEach(p => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${p.name}</td><td>${p.elo}</td>`;
        table.appendChild(row);
    });
}

function recordMatch() {
    let p1 = players[document.getElementById('p1').value];
    let p2 = players[document.getElementById('p2').value];
    let s1 = parseInt(document.getElementById('score1').value);
    let s2 = parseInt(document.getElementById('score2').value);
    if (isNaN(s1) || isNaN(s2)) return;

    let expected1 = 1 / (1 + Math.pow(10, (p2.elo - p1.elo) / 400));
    let expected2 = 1 / (1 + Math.pow(10, (p1.elo - p2.elo) / 400));
    let result1 = s1 > s2 ? 1 : (s1 === s2 ? 0.5 : 0);
    let result2 = s2 > s1 ? 1 : (s1 === s2 ? 0.5 : 0);
    let K = 32;

    p1.elo = Math.round(p1.elo + K * (result1 - expected1));
    p2.elo = Math.round(p2.elo + K * (result2 - expected2));

    savePlayers();
}

savePlayers();
