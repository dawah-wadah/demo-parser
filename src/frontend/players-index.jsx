import React from "react";
import { values } from "lodash";

import PlayerItem from "./player-item";

const PlayersIndex = ({ players, filteredPlayers }) => {
  if (players.length === 0) {
    return <div className="spinning-logo" />;
  }

  const playerRows = values(filteredPlayers)
    .slice(0, 15)
    .map(player => <PlayerItem key={player.steamInfo.id} player={player} />);

  const result =
    playerRows.length > 0 ? (
      playerRows
    ) : (
      <div className="fat-msg">No players found</div>
    );

  return (
    <div className="players-table">
      <div id="table-header">
        <div>Players</div>
      </div>
      <div className="players-list">{result}</div>
    </div>
  );
};

export default PlayersIndex;
