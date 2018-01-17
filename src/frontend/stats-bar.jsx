import React from "react";

const StatsBar = ({ games }) => {
  const gameStats = games.reduce(
    (prev, next) => {
      if (next.A) {
        prev.assists += next.A;
        prev.deaths += next.D;
        prev.kills += next.K;
      }
      
      if (next.Win) {
        prev.wins += 1;
      }
      return prev;
    },
    { assists: 0, deaths: 0, kills: 0, wins: 0 }
  );
  debugger
  return (
    <div className="stats-bar">
      <ul>
        <li>
          <span>Wins</span>
          <p id="wins-stats">{gameStats.wins}</p>
        </li>
        <li>
          <span>Kills</span>
          <p id="kills-stats">{gameStats.kills}</p>
        </li>
        <li>
          <span>Deaths</span>
          <p id="deaths-stats">{gameStats.deaths}</p>
        </li>
        <li>
          <span>Assists</span>
          <p id="assists-stats">{gameStats.assists}</p>
        </li>
      </ul>
    </div>
  );
};

export default StatsBar;
