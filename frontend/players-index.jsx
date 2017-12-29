import React from "react";
import { values } from "lodash";

import Row from "./tableRow.jsx";

const PlayersIndex = ({ players }) => (
  <div>{values(players).map(player => (
      <Row player={player} />
    ))}</div>
)

export default PlayersIndex;
