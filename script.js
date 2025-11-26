document.addEventListener("DOMContentLoaded", function() {
    // PAGE 1 & 2 LOGIC
    const page1NextButton = document.getElementById("next-button-page1");
    if (page1NextButton) {
        page1NextButton.addEventListener("click", function(event) {
            event.preventDefault(); 
            const team1Name = document.getElementById("team1-name").value;
            const team2Name = document.getElementById("team2-name").value;
            const numOvers = document.getElementById("num-overs").value;

            if (!team1Name || !team2Name || !numOvers) {
                alert("Please fill in all team names and the number of overs.");
                return;
            }
            localStorage.setItem("team1Name", team1Name);
            localStorage.setItem("team2Name", team2Name);
            localStorage.setItem("numOvers", numOvers);
            window.location.href = "page2.html";
        });
    }

    const battingDropdown = document.getElementById("batting-team-dropdown");
    if (battingDropdown) {
        const storedTeam1 = localStorage.getItem("team1Name");
        const storedTeam2 = localStorage.getItem("team2Name");
        
        const t1Header = document.getElementById("team1-header");
        const t2Header = document.getElementById("team2-header");
        if (t1Header) t1Header.textContent = `${storedTeam1 || "Team 1"} Player Names`;
        if (t2Header) t2Header.textContent = `${storedTeam2 || "Team 2"} Player Names`;

        const battingOption1 = battingDropdown.querySelector("option[value='team1']");
        const battingOption2 = battingDropdown.querySelector("option[value='team2']");

        if (storedTeam1 && battingOption1) battingOption1.textContent = storedTeam1;
        if (storedTeam2 && battingOption2) battingOption2.textContent = storedTeam2;

        const backButton = document.getElementById("back-button");
        if (backButton) {
            backButton.addEventListener("click", function(event) {
                event.preventDefault();
                window.location.href = "index.html";
            });
        }

        const page2NextButton = document.getElementById("page2-next-button");
        if (page2NextButton) {
            page2NextButton.addEventListener("click", function(event) {
                event.preventDefault();
                let team1Players = [];
                let team2Players = [];
                let allFieldsFilled = true;

                for (let i = 1; i <= 11; i++) {
                    let input = document.getElementById(`Player${i}`);
                    if (!input || input.value.trim() === "") {
                        allFieldsFilled = false;
                        if(input) input.style.border = "2px solid red";
                    } else {
                        if(input) input.style.border = "";
                        team1Players.push(input.value.trim());
                    }
                }

                for (let i = 1; i <= 11; i++) {
                    let input = document.getElementById(`t2-player${i}`);
                    if (!input || input.value.trim() === "") {
                        allFieldsFilled = false;
                        if(input) input.style.border = "2px solid red";
                    } else {
                        if(input) input.style.border = "";
                        team2Players.push(input.value.trim());
                    }
                }

                if (battingDropdown.value === "default") {
                    allFieldsFilled = false;
                    battingDropdown.style.border = "2px solid red";
                } else {
                    battingDropdown.style.border = "";
                }

                if (!allFieldsFilled) {
                    alert("Please fill in ALL player names and select the batting team.");
                } else {
                    localStorage.setItem("team1Players", JSON.stringify(team1Players));
                    localStorage.setItem("team2Players", JSON.stringify(team2Players));
                    let battingTeamName = (battingDropdown.value === "team1") ? storedTeam1 : storedTeam2;
                    localStorage.setItem("battingTeam", battingTeamName);
                    
                    localStorage.removeItem("matchState");
                    localStorage.removeItem("matchStats"); 
                    localStorage.setItem("dismissedPlayers", JSON.stringify([]));
                    localStorage.setItem("bowlerHistory", JSON.stringify([]));
                    localStorage.setItem("currentInnings", "1st Innings");
                    window.location.href = "score.html";
                }
            });
        }
    }

    const matchHeader = document.getElementById("match-header");
    if (matchHeader) {
        if (window.location.pathname.includes("score2.html")) {
            initPage4();
        } else {
            initPage3();
        }
    }

    const summaryTitle = document.getElementById("summary-team-name");
    if (summaryTitle) {
        initSummaryPage();
    }

    // New Check for Match Summary Page
    const winnerBanner = document.getElementById("winner-banner");
    if (winnerBanner) {
        initMatchSummaryPage();
    }
});

function formatName(fullName) {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length > 1) {
        const firstNameInitial = parts[0][0].toUpperCase();
        const lastName = parts[parts.length - 1]; 
        return `${firstNameInitial}. ${lastName}`;
    }
    return fullName;
}

function getOversFromBalls(balls) {
    const overs = Math.floor(balls / 6);
    const remainder = balls % 6;
    return `${overs}.${remainder}`;
}

function initMatchStats() {
    if (!localStorage.getItem("matchStats")) {
        const stats = {
            batting: {}, 
            bowling: {}, 
            extras: { wd: 0, nb: 0, lb: 0, b: 0, pen: 0 }
        };
        localStorage.setItem("matchStats", JSON.stringify(stats));
    }
}

function initPage3() {
    initMatchStats();

    const matchHeader = document.getElementById("match-header");
    const t1 = localStorage.getItem("team1Name") || "Team 1";
    const t2 = localStorage.getItem("team2Name") || "Team 2";
    matchHeader.textContent = `${t1} VS ${t2}`;

    const battingTeam = localStorage.getItem("battingTeam");
    const bowlingTeam = (battingTeam === t1) ? t2 : t1;
    const currentInnings = localStorage.getItem("currentInnings") || "1st Innings";

    document.getElementById("innings-label").textContent = currentInnings;
    document.getElementById("batting-team-name").textContent = battingTeam;
    document.getElementById("bowling-team-name").textContent = bowlingTeam;

    const targetLabel = document.getElementById("target-label");
    if (currentInnings === "2nd Innings") {
        if(targetLabel) targetLabel.textContent = "TARGET";
    } else {
        if(targetLabel) targetLabel.textContent = "Projected Score";
    }

    const matchState = JSON.parse(localStorage.getItem("matchState"));

    if (matchState) {
        displayActiveMatch(matchState);
        score.maxOvers = parseInt(localStorage.getItem("numOvers")) || 0;
        
        const savedScore = JSON.parse(localStorage.getItem("teamScore")) || { runs: 0, wickets: 0, balls: 0, fullover: 0 };
        score.runs = savedScore.runs;
        score.wickets = savedScore.wickets;
        score.balls = savedScore.balls;
        score.fullover = savedScore.fullover;
        score.overs = `${score.fullover}.${score.balls}`;
        updateDisplay();
    } else {
        renderPlayerSelection();
    }
}

function initPage4() {
    initMatchStats();

    const matchHeader = document.getElementById("match-header");
    const t1 = localStorage.getItem("team1Name") || "Team 1";
    const t2 = localStorage.getItem("team2Name") || "Team 2";
    matchHeader.textContent = `${t1} VS ${t2}`;

    const battingTeam = localStorage.getItem("battingTeam");
    const bowlingTeam = (battingTeam === t1) ? t2 : t1;

    document.getElementById("innings-label").textContent = "2nd Innings";
    document.getElementById("batting-team-name").textContent = battingTeam;
    document.getElementById("bowling-team-name").textContent = bowlingTeam;

    const target = parseInt(localStorage.getItem("targetScore")) || 0;
    document.getElementById("projected-display").textContent = target;

    const matchState = JSON.parse(localStorage.getItem("matchState"));

    if (matchState) {
        displayActiveMatch(matchState);
        score.maxOvers = parseInt(localStorage.getItem("numOvers")) || 0;
        
        const savedScore = JSON.parse(localStorage.getItem("teamScore")) || { runs: 0, wickets: 0, balls: 0, fullover: 0 };
        score.runs = savedScore.runs;
        score.wickets = savedScore.wickets;
        score.balls = savedScore.balls;
        score.fullover = savedScore.fullover;
        score.overs = `${score.fullover}.${score.balls}`;
        updateDisplay();
    } else {
        renderPlayerSelection();
    }
}

function renderPlayerSelection() {
    const t1 = localStorage.getItem("team1Name");
    const battingTeamName = localStorage.getItem("battingTeam");
    const t1Players = JSON.parse(localStorage.getItem("team1Players")) || [];
    const t2Players = JSON.parse(localStorage.getItem("team2Players")) || [];

    let battingSquad = (battingTeamName === t1) ? t1Players : t2Players;
    let bowlingSquad = (battingTeamName === t1) ? t2Players : t1Players;

    localStorage.setItem("battingSquad", JSON.stringify(battingSquad));
    localStorage.setItem("bowlingSquad", JSON.stringify(bowlingSquad));

    const strikerSlot = document.getElementById("striker-slot");
    const nonStrikerSlot = document.getElementById("non-striker-slot");
    const bowlerSlot = document.getElementById("bowler-slot");
    const startBtn = document.getElementById("start-match-btn-container");

    strikerSlot.innerHTML = createDropdownHTML(battingSquad, "select-striker", "Select Striker");
    nonStrikerSlot.innerHTML = createDropdownHTML(battingSquad, "select-non-striker", "Select Non-Striker");
    bowlerSlot.innerHTML = createDropdownHTML(bowlingSquad, "select-bowler", "Select Bowler");
    
    startBtn.style.display = "block";
}

function createDropdownHTML(players, id, label) {
    let html = `<select id="${id}"><option value="">${label}</option>`;
    players.forEach(p => {
        html += `<option value="${p}">${p}</option>`;
    });
    html += `</select>`;
    return html;
}

function startMatch() {
    const striker = document.getElementById("select-striker").value;
    const nonStriker = document.getElementById("select-non-striker").value;
    const bowler = document.getElementById("select-bowler").value;

    if (striker === "" || nonStriker === "" || bowler === "") {
        alert("Please select Striker, Non-Striker, and Bowler.");
        return;
    }
    if (striker === nonStriker) {
        alert("Striker and Non-Striker cannot be the same person!");
        return;
    }

    const matchState = {
        striker: striker,
        nonStriker: nonStriker,
        bowler: bowler
    };

    localStorage.setItem("matchState", JSON.stringify(matchState));
    localStorage.setItem("dismissedPlayers", JSON.stringify([])); 
    localStorage.setItem("bowlerHistory", JSON.stringify([]));
    score.maxOvers = parseInt(localStorage.getItem("numOvers")) || 0;

    initializePlayerStats(striker, 'batting');
    initializePlayerStats(nonStriker, 'batting');
    initializePlayerStats(bowler, 'bowling');

    document.getElementById("start-match-btn-container").style.display = "none";
    displayActiveMatch(matchState);
}

function initializePlayerStats(playerName, type) {
    let stats = JSON.parse(localStorage.getItem("matchStats"));
    if (type === 'batting' && !stats.batting[playerName]) {
        stats.batting[playerName] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false };
    } else if (type === 'bowling' && !stats.bowling[playerName]) {
        stats.bowling[playerName] = { runs: 0, wickets: 0, balls: 0, overs: 0 };
    }
    localStorage.setItem("matchStats", JSON.stringify(stats));
}

function displayActiveMatch(state) {
    const controls = document.getElementById("scoring-controls");
    controls.style.pointerEvents = "auto";
    controls.style.opacity = "1";

    const stats = JSON.parse(localStorage.getItem("matchStats"));

    const sName = formatName(state.striker);
    const sData = stats.batting[state.striker] || { runs: 0, balls: 0 };
    const strikerHTML = `
        <div class="player-row">
            <div class="player-name">🏏 ${sName}</div>
            <div class="player-stats">${sData.runs} <span class="stat-detail">(${sData.balls})</span></div>
        </div>`;

    const nsName = formatName(state.nonStriker);
    const nsData = stats.batting[state.nonStriker] || { runs: 0, balls: 0 };
    const nonStrikerHTML = `
        <div class="player-row">
            <div class="player-name" style="color: #333;">${nsName}</div>
            <div class="player-stats" style="background-color: transparent; color: #333; border: 1px solid #333;">${nsData.runs} <span class="stat-detail">(${nsData.balls})</span></div>
        </div>`;

    const bName = formatName(state.bowler);
    const bData = stats.bowling[state.bowler] || { runs: 0, wickets: 0, balls: 0 };
    const bOvers = getOversFromBalls(bData.balls);
    const bowlerHTML = `
        <div class="player-row">
            <div class="player-name">🥎 ${bName}</div>
            <div class="player-stats">${bData.wickets}-${bData.runs} <span class="stat-detail">(${bOvers})</span></div>
        </div>`;

    document.getElementById("striker-slot").innerHTML = strikerHTML;
    document.getElementById("non-striker-slot").innerHTML = nonStrikerHTML;
    document.getElementById("bowler-slot").innerHTML = bowlerHTML;
}

const score = {
    runs: 0, wickets: 0, lastResult: 0, fullover: 0, balls: 0, overs: 0, maxOvers: 0
};

function updateDisplay() {
    document.getElementById("score-display").textContent = `${score.runs}-${score.wickets}`;
    document.getElementById("overs-display").textContent = `(${score.overs})`;

    const totalBallsBowled = (score.fullover * 6) + score.balls;
    let crr = 0;
    if (totalBallsBowled > 0) crr = (score.runs / totalBallsBowled) * 6;
    
    document.getElementById("crr-display").textContent = crr.toFixed(2);

    const currentInnings = localStorage.getItem("currentInnings");
    score.maxOvers = parseInt(localStorage.getItem("numOvers")) || 0;

    if (currentInnings === "2nd Innings") {
        const target = parseInt(localStorage.getItem("targetScore")) || 0;
        document.getElementById("projected-display").textContent = target;
        
        const runsNeeded = target - score.runs;
        const totalBalls = score.maxOvers * 6;
        const ballsRemaining = totalBalls - totalBallsBowled;
        
        let rrr = 0;
        if (ballsRemaining > 0 && runsNeeded > 0) {
            rrr = (runsNeeded / ballsRemaining) * 6;
        }
        
        const rrrDisplay = document.getElementById("rrr-display");
        if(rrrDisplay) rrrDisplay.textContent = rrr.toFixed(2);

    } else {
        let projected = 0;
        if (score.maxOvers > 0) projected = Math.round(crr * score.maxOvers);
        document.getElementById("projected-display").textContent = projected;
    }
    
    localStorage.setItem("teamScore", JSON.stringify(score));
}

function swapStrikers() {
    let matchState = JSON.parse(localStorage.getItem("matchState"));
    if(matchState) {
        let temp = matchState.striker;
        matchState.striker = matchState.nonStriker;
        matchState.nonStriker = temp;
        localStorage.setItem("matchState", JSON.stringify(matchState));
        displayActiveMatch(matchState);
    }
}

function updatePlayerStats(result) {
    let stats = JSON.parse(localStorage.getItem("matchStats"));
    let matchState = JSON.parse(localStorage.getItem("matchState"));
    const striker = matchState.striker;
    const bowler = matchState.bowler;

    initializePlayerStats(striker, 'batting');
    initializePlayerStats(bowler, 'bowling');

    if (typeof result === 'number') {
        if (result !== 5 && result !== 7) {
            stats.batting[striker].runs += result;
            stats.batting[striker].balls += 1;
            stats.bowling[bowler].runs += result;
            stats.bowling[bowler].balls += 1;
            if (result === 4) stats.batting[striker].fours += 1;
            if (result === 6) stats.batting[striker].sixes += 1;
        }
        else if (result === 5) {
            stats.batting[striker].runs += 4;
            stats.bowling[bowler].runs += 5;
            if(!stats.extras.pen) stats.extras.pen = 0;
            stats.extras.pen += 5; 
        }
        else if (result === 7) {
            stats.batting[striker].runs += 6;
            stats.bowling[bowler].runs += 7;
            if(!stats.extras.pen) stats.extras.pen = 0;
            stats.extras.pen += 7;
        }
    } 
    else if (result === 'W') {
        stats.batting[striker].balls += 1;
        stats.batting[striker].out = true;
        stats.bowling[bowler].wickets += 1;
        stats.bowling[bowler].balls += 1;
    }
    else if (result === 'WD') {
        stats.extras.wd += 1;
        stats.bowling[bowler].runs += 1; 
    }
    else if (result === 'NB') {
        stats.extras.nb += 1;
        stats.bowling[bowler].runs += 1;
    }

    localStorage.setItem("matchStats", JSON.stringify(stats));
}

function revertPlayerStats(result) {
    let stats = JSON.parse(localStorage.getItem("matchStats"));
    let matchState = JSON.parse(localStorage.getItem("matchState"));
    const striker = matchState.striker; 
    const bowler = matchState.bowler;

    if (typeof result === 'number') {
        if (result !== 5 && result !== 7) {
            stats.batting[striker].runs -= result;
            stats.batting[striker].balls -= 1;
            stats.bowling[bowler].runs -= result;
            stats.bowling[bowler].balls -= 1;
            if (result === 4) stats.batting[striker].fours -= 1;
            if (result === 6) stats.batting[striker].sixes -= 1;
        }
        else if (result === 5) {
            stats.batting[striker].runs -= 4;
            stats.bowling[bowler].runs -= 5;
            if(stats.extras.pen > 0) stats.extras.pen -= 5; 
        }
        else if (result === 7) {
            stats.batting[striker].runs -= 6;
            stats.bowling[bowler].runs -= 7;
            if(stats.extras.pen > 0) stats.extras.pen -= 7; 
        }
    }
    else if (result === 'W') {
        stats.batting[striker].balls -= 1;
        stats.batting[striker].out = false;
        stats.bowling[bowler].wickets -= 1;
        stats.bowling[bowler].balls -= 1;
    }
    else if (result === 'WD') {
        stats.extras.wd -= 1;
        stats.bowling[bowler].runs -= 1;
    }
    else if (result === 'NB') {
        stats.extras.nb -= 1;
        stats.bowling[bowler].runs -= 1;
    }

    localStorage.setItem("matchStats", JSON.stringify(stats));
}

function promptNextBatsman() {
    const controls = document.getElementById("scoring-controls");
    controls.style.pointerEvents = "none";
    controls.style.opacity = "0.5";

    const strikerSlot = document.getElementById("striker-slot");
    const battingSquad = JSON.parse(localStorage.getItem("battingSquad")) || [];
    const matchState = JSON.parse(localStorage.getItem("matchState"));
    const dismissedPlayers = JSON.parse(localStorage.getItem("dismissedPlayers")) || [];

    let html = `
        <p style="font-size:0.8rem; color:red; margin:0;">WICKET! Select Batsman</p>
        <select id="new-batsman-select" style="margin-bottom:5px; width: 100%;">
            <option value="">Select Batsman</option>
    `;
    battingSquad.forEach(p => {
        if (p !== matchState.nonStriker && !dismissedPlayers.includes(p)) {
            html += `<option value="${p}">${p}</option>`;
        }
    });
    html += `</select>
    <button class="btn-grad" style="padding: 5px 10px; font-size: 0.8rem; margin:0;" onclick="confirmNewBatsman()">OK</button>`;
    strikerSlot.innerHTML = html;
}

window.confirmNewBatsman = function() {
    const select = document.getElementById("new-batsman-select");
    const newBatsman = select.value;
    if(!newBatsman) { alert("Select a batsman"); return; }

    let matchState = JSON.parse(localStorage.getItem("matchState"));
    matchState.striker = newBatsman; 
    localStorage.setItem("matchState", JSON.stringify(matchState));
    initializePlayerStats(newBatsman, 'batting');
    displayActiveMatch(matchState);
    checkEndOfOver();
}

function promptNextBowler() {
    const controls = document.getElementById("scoring-controls");
    controls.style.pointerEvents = "none";
    controls.style.opacity = "0.5";

    const bowlerSlot = document.getElementById("bowler-slot");
    const bowlingSquad = JSON.parse(localStorage.getItem("bowlingSquad")) || [];
    
    const matchState = JSON.parse(localStorage.getItem("matchState"));
    const currentBowler = matchState ? matchState.bowler : "";

    let html = `
        <p style="font-size:0.8rem; color:red; margin:0;">End of Over! Select Bowler</p>
        <select id="new-bowler-select" style="margin-bottom:5px; width:100%;">
            <option value="">Select Bowler</option>
    `;
    bowlingSquad.forEach(p => {
        if (p !== currentBowler) {
            html += `<option value="${p}">${p}</option>`;
        }
    });
    html += `</select>
    <button class="btn-grad" style="padding: 5px 10px; font-size: 0.8rem; margin:0;" onclick="confirmNewBowler()">OK</button>`;
    bowlerSlot.innerHTML = html;
}

window.confirmNewBowler = function() {
    const select = document.getElementById("new-bowler-select");
    const newBowler = select.value;
    if(!newBowler) { alert("Select a bowler"); return; }

    let matchState = JSON.parse(localStorage.getItem("matchState"));
    let history = JSON.parse(localStorage.getItem("bowlerHistory")) || [];
    history.push(matchState.bowler);
    localStorage.setItem("bowlerHistory", JSON.stringify(history));

    matchState.bowler = newBowler;
    localStorage.setItem("matchState", JSON.stringify(matchState));
    initializePlayerStats(newBowler, 'bowling');
    displayActiveMatch(matchState);
}

function updateScore(result) {
    const currentInnings = localStorage.getItem("currentInnings");
    
    // Check Overs/Wickets limit
    if (score.fullover >= score.maxOvers || score.wickets >= 10) {
        if (currentInnings === "2nd Innings") {
            alert("Match Over!");
            window.location.href = "match_summary.html"; // Redirect to Final Summary
        } else {
            alert("Innings Over!");
            window.location.href = "innings_summary.html";
        }
        return;
    }

    updatePlayerStats(result);

    if (typeof result === 'number') {
        score.runs += result;
        if (result !== 5 && result !== 7) {
            score.balls++;
        }
    } else if (result === 'W') {
        score.wickets++;
        score.balls++;
        let dismissed = JSON.parse(localStorage.getItem("dismissedPlayers")) || [];
        let currentState = JSON.parse(localStorage.getItem("matchState"));
        dismissed.push(currentState.striker); 
        localStorage.setItem("dismissedPlayers", JSON.stringify(dismissed));
    } else if (result === 'WD' || result === 'NB') {
        score.runs++;
    }

    score.lastResult = result;
    score.overs = `${score.fullover}.${score.balls}`;
    updateDisplay();
    displayActiveMatch(JSON.parse(localStorage.getItem("matchState")));

    // WIN CHECK FOR 2ND INNINGS (Chase Success)
    if (currentInnings === "2nd Innings") {
        const target = parseInt(localStorage.getItem("targetScore")) || 0;
        if (score.runs >= target) {
            const batTeam = localStorage.getItem("battingTeam");
            alert(`MATCH OVER! ${batTeam} WINS!`);
            window.location.href = "match_summary.html"; // Redirect to Final Summary
            return;
        }
    }

    if (result === 'W') {
        if (score.wickets >= 10) {
            // All Out Logic
            if (currentInnings === "2nd Innings") {
                 alert("All Out! Match Over.");
                 window.location.href = "match_summary.html"; // Redirect to Final Summary
            } else {
                 alert("All Out! Innings Ended.");
                 window.location.href = "innings_summary.html";
            }
        } else {
            promptNextBatsman();
        }
    } else {
        if (result === 1 || result === 3) {
            swapStrikers();
        }
        checkEndOfOver();
    }
}

function checkEndOfOver() {
    if (score.balls === 6) {
        score.fullover++;
        score.balls = 0;
        score.overs = `${score.fullover}.${score.balls}`;
        updateDisplay();
        swapStrikers();

        const currentInnings = localStorage.getItem("currentInnings");

        if (score.fullover < score.maxOvers) {
            promptNextBowler();
        } else {
            // Max Overs Reached
            if (currentInnings === "2nd Innings") {
                 alert("Max Overs Reached. Match Over.");
                 window.location.href = "match_summary.html"; // Redirect to Final Summary
            } else {
                 alert("Max Overs Reached.");
                 window.location.href = "innings_summary.html";
            }
        }
    }
}

function resetScore() {
    if(!confirm("Restart Match? This wipes all data.")) return;
    score.runs = 0; score.wickets = 0; score.balls = 0; score.fullover = 0; score.overs = 0;
    localStorage.removeItem("matchState");
    localStorage.removeItem("matchStats");
    localStorage.removeItem("targetScore");
    // Clear archived stats too
    localStorage.removeItem("innings1Stats");
    localStorage.removeItem("innings1Score");
    localStorage.removeItem("innings1Team");
    
    localStorage.setItem("dismissedPlayers", JSON.stringify([]));
    localStorage.setItem("bowlerHistory", JSON.stringify([]));
    localStorage.setItem("teamScore", JSON.stringify(score));
    localStorage.setItem("currentInnings", "1st Innings");
    updateDisplay();
    window.location.reload();
}

function undoScore(lr) {
    if (score.balls === 0 && score.fullover > 0) {
        score.fullover--; 
        score.balls = 5; 
        swapStrikers();
        
        let history = JSON.parse(localStorage.getItem("bowlerHistory")) || [];
        let prevBowler = history.pop();
        if (prevBowler) {
            let matchState = JSON.parse(localStorage.getItem("matchState"));
            matchState.bowler = prevBowler;
            localStorage.setItem("matchState", JSON.stringify(matchState));
            localStorage.setItem("bowlerHistory", JSON.stringify(history));
        }
    }

    if (lr === 1 || lr === 3) {
        swapStrikers();
    }

    if (lr === 'W') {
        let dismissed = JSON.parse(localStorage.getItem("dismissedPlayers")) || [];
        const resurrectedPlayer = dismissed.pop(); 
        localStorage.setItem("dismissedPlayers", JSON.stringify(dismissed));
        
        let matchState = JSON.parse(localStorage.getItem("matchState"));
        matchState.striker = resurrectedPlayer;
        localStorage.setItem("matchState", JSON.stringify(matchState));
        
        score.wickets--;
    } 

    if (typeof lr === 'number') {
        if (lr !== 5 && lr !== 7) {
            if (score.balls > 0) score.balls--; 
        }
        score.runs -= lr;
    } else if (lr === 'W') {
        if (score.balls > 0) score.balls--;
    } else if (lr === 'WD' || lr === 'NB') {
        score.runs--;
    }

    revertPlayerStats(lr);

    score.overs = `${score.fullover}.${score.balls}`;
    updateDisplay();
    displayActiveMatch(JSON.parse(localStorage.getItem("matchState")));
}

function initSummaryPage() {
    const battingTeam = localStorage.getItem("battingTeam");
    const scoreStats = JSON.parse(localStorage.getItem("teamScore")) || {runs:0, wickets:0, fullover:0, balls:0};
    const stats = JSON.parse(localStorage.getItem("matchStats")) || {batting:{}, bowling:{}, extras:{wd:0,nb:0,lb:0,b:0,pen:0}};

    document.getElementById("summary-team-name").textContent = battingTeam;
    document.getElementById("summary-score").textContent = `${scoreStats.runs}-${scoreStats.wickets} (${scoreStats.fullover}.${scoreStats.balls})`;
    
    const targetSpan = document.getElementById("summary-target");
    if (targetSpan) {
        const currentInnings = localStorage.getItem("currentInnings");
        let target = 0;
        if(currentInnings !== "2nd Innings") {
             target = scoreStats.runs + 1;
             localStorage.setItem("targetScore", target);
        } else {
             target = localStorage.getItem("targetScore") || 0;
        }
        targetSpan.textContent = target;
    }

    // Reuse helper to render the table in innings_summary.html
    renderInningsTable("batting-tbody", "bowling-tbody", stats, "summary-extras");
}

// CHANGED: Helper function to render tables (Used by both summary pages)
function renderInningsTable(battingTbodyId, bowlingTbodyId, stats, extrasId) {
    const battingBody = document.getElementById(battingTbodyId);
    let batHTML = "";
    for (const [player, data] of Object.entries(stats.batting)) {
        let sr = 0;
        if (data.balls > 0) sr = (data.runs / data.balls) * 100;
        
        batHTML += `
            <tr>
                <td style="text-align: left;">${formatName(player)} ${data.out ? "(out)" : "*"}</td>
                <td>${data.runs}</td>
                <td>${data.balls}</td>
                <td>${data.fours}</td>
                <td>${data.sixes}</td>
                <td>${sr.toFixed(2)}</td>
            </tr>`;
    }
    battingBody.innerHTML = batHTML;

    const bowlingBody = document.getElementById(bowlingTbodyId);
    let bowlHTML = "";
    for (const [player, data] of Object.entries(stats.bowling)) {
        const overPart = Math.floor(data.balls / 6);
        const ballPart = data.balls % 6;
        const displayOvers = `${overPart}.${ballPart}`;
        
        let econ = 0;
        if (data.balls > 0) {
            econ = data.runs / (data.balls/6);
        }

        bowlHTML += `
            <tr>
                <td style="text-align: left;">${formatName(player)}</td>
                <td>${displayOvers}</td>
                <td>${data.runs}</td>
                <td>${data.wickets}</td>
                <td>${econ.toFixed(2)}</td>
            </tr>`;
    }
    bowlingBody.innerHTML = bowlHTML;

    if (extrasId) {
        const ex = stats.extras;
        const totalExtras = ex.wd + ex.nb + ex.lb + ex.b + (ex.pen || 0);
        const exEl = document.getElementById(extrasId);
        if(exEl) exEl.textContent = totalExtras;
    }
}

// CHANGED: Logic to archive 1st innings data
function startSecondInnings() {
    const t1 = localStorage.getItem("team1Name");
    const t2 = localStorage.getItem("team2Name");
    const currentBatting = localStorage.getItem("battingTeam");
    
    // ARCHIVE 1ST INNINGS DATA
    localStorage.setItem("innings1Stats", localStorage.getItem("matchStats"));
    localStorage.setItem("innings1Score", localStorage.getItem("teamScore"));
    localStorage.setItem("innings1Team", currentBatting);

    const newBatting = (currentBatting === t1) ? t2 : t1;
    localStorage.setItem("battingTeam", newBatting);
    
    localStorage.setItem("currentInnings", "2nd Innings");

    localStorage.removeItem("matchState");
    localStorage.removeItem("matchStats"); 
    localStorage.setItem("dismissedPlayers", JSON.stringify([]));
    localStorage.setItem("bowlerHistory", JSON.stringify([]));
    
    const newScore = { runs: 0, wickets: 0, balls: 0, fullover: 0, overs: 0 };
    localStorage.setItem("teamScore", JSON.stringify(newScore));

    window.location.href = "score2.html";
}

// CHANGED: New Logic for the Final Summary Page
function initMatchSummaryPage() {
    // 1. Get Data
    const innings1Team = localStorage.getItem("innings1Team");
    const innings1Score = JSON.parse(localStorage.getItem("innings1Score")) || {};
    const innings1Stats = JSON.parse(localStorage.getItem("innings1Stats")) || {};

    const innings2Team = localStorage.getItem("battingTeam"); // Current/Last batting team
    const innings2Score = JSON.parse(localStorage.getItem("teamScore")) || {};
    const innings2Stats = JSON.parse(localStorage.getItem("matchStats")) || {};

    // 2. Determine Winner
    const target = parseInt(localStorage.getItem("targetScore")) || 0;
    const chaserRuns = innings2Score.runs;
    const winnerBanner = document.getElementById("winner-banner");

    if (chaserRuns >= target) {
        // Chasing Team Wins
        const wicketsLeft = 10 - innings2Score.wickets;
        winnerBanner.textContent = `${innings2Team} WON BY ${wicketsLeft} WICKETS`;
        winnerBanner.style.color = "#fff"; // Dark Green
        winnerBanner.style.borderColor = "#88cc44";
    } else {
        // Defending Team Wins (First Innings Team)
        // Tie Logic check: if runs == target - 1
        if (chaserRuns === target - 1) {
            winnerBanner.textContent = "MATCH TIED";
            winnerBanner.style.color = "#fff";
        } else {
            const runDiff = (target - 1) - chaserRuns;
            winnerBanner.textContent = `${innings1Team} WON BY ${runDiff} RUNS`;
            winnerBanner.style.color = "#006400";
            winnerBanner.style.borderColor = "#006400";
        }
    }

    // 3. Render Innings 1
    document.getElementById("i1-team-name").textContent = innings1Team;
    document.getElementById("i1-score").textContent = `${innings1Score.runs}-${innings1Score.wickets} (${innings1Score.fullover}.${innings1Score.balls})`;
    renderInningsTable("i1-batting", "i1-bowling", innings1Stats, "i1-extras");

    // 4. Render Innings 2
    document.getElementById("i2-team-name").textContent = innings2Team;
    document.getElementById("i2-score").textContent = `${innings2Score.runs}-${innings2Score.wickets} (${innings2Score.fullover}.${innings2Score.balls})`;
    renderInningsTable("i2-batting", "i2-bowling", innings2Stats, "i2-extras");
}
