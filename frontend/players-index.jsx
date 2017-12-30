import React from "react";
import { isEmpty, values } from "lodash";

import Row from "./tableRow.jsx";

const PlayersIndex = ({ players, filteredPlayers }) => {
  if (players.length === 0) {
    return <div className="spinning-logo" />;
  }

  const tableRows = values(filteredPlayers).map(player => (
    <Row key={player.steamInfo.id} player={player} />
  ));

  const result =
    tableRows.length > 0 ? (
      tableRows
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
