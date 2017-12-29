import React from "react";
import { isEmpty, values } from "lodash";

import Row from "./tableRow.jsx";

const PlayersIndex = ({ players, filteredPlayers }) => {
  if (players.length === 0) {
    return (
      <img className="spinning-logo" src="https://pbs.twimg.com/profile_images/889501252991594496/KaRaZTG3.jpg" />
    )
  }

  const tableRows = values(filteredPlayers).map(player => (
    <Row key={player.steamInfo.id} player={player} />
  ));

  const result = (tableRows.length > 0 ? tableRows : "No players found")

  return <div className="players-list">{result}</div>;
};

export default PlayersIndex;
