import React, { useState } from "react";
import "./App.css";

function App() {
  const [playerNames, setPlayerNames] = useState([
    "R",
    "Harfan",
    "K sunni"
  ]);

  const [teamNames, setTeamNames] = useState([
    "Arg - Int",
    "Eng - Int",
    "Fra - Int",
    "Brz - Int",
    "Por - Int",
    "Spa - Int",
    "Ita - Int",
    "Liv - Int",
    "Bel - Int",
    "Ger - Int",
    "Inter - Club",
    "Rm - Club",
    "Bay - Club",
    "Psg - Club",
    "City - Club",
    "FCB - Club",
    "ARS - Club",
    "Spurs - Club",
  ]);

  const [tournamentData, setTournamentData] = useState(null);

  const generateTournament = () => {
    // Make a POST request to your API endpoint (e.g., '/assign-teams')
    fetch("/assign-teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerNames,
        teamNames,
      }),
    })
      .then((response) => response.json())
      .then((data) => setTournamentData(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  function getPlayerAndTeamNames(teamName) {
    for (const player of tournamentData.players) {
      for (const team of player.teams) {
        if (team.name === teamName) {
          return `${player.name} (${team.name})`;
        }
      }
    }
    return "Unknown Player"; // Handle cases where team name is not found
  }

  const [winnerName, setWinnerName] = useState(""); // State for winner's name
  const [pointsTable, setPointsTable] = useState({}); // State for points table

  // Function to update the points table with the winner's points
  const updatePointsTable = () => {
    if (winnerName.trim() === "") {
      alert("Please enter the winner's name.");
      return;
    }

    // Update points for the winner
    setPointsTable((prevPointsTable) => ({
      ...prevPointsTable,
      [winnerName]: (prevPointsTable[winnerName] || 0) + 1,
    }));

    // Clear the winner's name input field
    setWinnerName("");
  };

  return (
    <div className="container">
      <div className="left-box">
        <h2>Player Names</h2>
        <ul>
          {playerNames.map((playerName, index) => (
            <li key={index}>{playerName}</li>
          ))}
        </ul>

        <h2>Team Names</h2>
        <ul>
          {teamNames.map((teamName, index) => (
            <li key={index}>{teamName}</li>
          ))}
        </ul>

        <button onClick={generateTournament}>Generate Tournament</button>
      </div>

      <div className="right-box">
        {tournamentData && (
          <div>
            <div className="assigned-teams">
              <h2>Assigned Teams</h2>
              {tournamentData.players.map((player, index) => (
                <div key={index}>
                  <h3>{player.name}</h3>
                  <ul>
                    {player.teams.map((team, index) => (
                      <li key={index}>{team.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="matches-box">
        {tournamentData && (
          <div>
            <h2>Matches</h2>
            {tournamentData.matches.map((match, index) => (
              <div key={index}>
                <ul>
                  <p>
                    {getPlayerAndTeamNames(match.team1.name)} vs{" "}
                    {getPlayerAndTeamNames(match.team2.name)}
                  </p>
                </ul>
              </div>
            ))}
          </div>
        )}

        <div className="points-table">
          <h2>Points Table</h2>
          <ul>
            {Object.entries(pointsTable).map(([playerName, points], index) => (
              <li key={index}>
                {playerName}: {points}
              </li>
            ))}
          </ul>
        </div>

        {/* Winner input */}
        <div className="winner-input">
          <input
            type="text"
            placeholder="Enter winner's name"
            value={winnerName}
            onChange={(e) => setWinnerName(e.target.value)}
          />
          <button onClick={updatePointsTable}>Update Points</button>
        </div>
      </div>
    </div>
  );
}

export default App;
