# 🏏 CricScore - Virtual Cricket Scorecard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Live-success.svg)

**CricScore** is a fully functional, browser-based cricket scoring prototype designed to track matches ball-by-ball. It provides a seamless interface for managing teams, tracking live scores, calculating run rates, and generating detailed innings summaries without the need for a backend server.

---

## 🚀 Live Demo

The application is deployed and ready to use. Click the link below to start scoring:

👉 **[vedant102-code.github.io/Cricket-Scorecard/](https://vedant102-code.github.io/Cricket-Scorecard/)**

---

## ✨ Features

### 📋 Match Setup & Management
- **Custom Configuration:** Set custom team names and match duration (number of overs).
- **Squad Entry:** Input names for playing 11s and determine the toss winner/batting team.

### 🏏 Live Scoring Interface
- **Ball-by-Ball Tracking:** Buttons for 0-7 runs, Wickets, and Extras (Wide, No Ball).
- **Smart Logic:**
  - Automatic **Strike Rotation** on odd runs and over completion.
  - **Wicket Handling:** Prompts to select the next incoming batsman.
  - **Bowler Rotation:** Prompts to change bowlers after an over ends.
- **Undo Capability:** "Undo" button to revert the last ball in case of scoring errors.

### 📊 Real-Time Statistics
- **Dynamic Scoreboard:** Updates runs, wickets, and overs instantly.
- **Run Rates:**
  - **CRR (Current Run Rate)** displayed throughout the match.
  - **RRR (Required Run Rate)** calculated automatically during the 2nd innings chase.
- **Projected Score:** Estimates the final total based on the current run rate (1st Innings).

### 🏆 Comprehensive Summaries
- **Innings Summary:** Detailed batting and bowling scorecards generated after the 1st innings.
- **Match Summary:** A final report comparing both innings side-by-side with a clear **Winner Banner** (e.g., "Team A won by 4 wickets").

### 💾 Data Persistence
- Uses **Local Storage** to save match progress. You can refresh the page or close the browser without losing the current score.

---

## 🛠️ Tech Stack

| Technology | Usage |
| :--- | :--- |
| **HTML5** | Semantic structure and layout of the application. |
| **CSS3** | Custom styling, gradients, flexbox layouts, and responsive design. |
| **JavaScript (ES6+)** | Core game logic, DOM manipulation, state management, and calculations. |

---

## 📂 Project Structure

```text
/
├── index.html            # Landing page (Match Setup: Team names & Overs)
├── page2.html            # Squad Entry (Player names & Toss)
├── score.html            # 1st Innings Scoreboard Interface
├── score2.html           # 2nd Innings Scoreboard (Chase Logic)
├── innings_summary.html  # Mid-match summary report
├── match_summary.html    # Final match result & combined scorecards
├── style.css             # Global stylesheet for all pages
└── script.js             # Main application logic & state handling
