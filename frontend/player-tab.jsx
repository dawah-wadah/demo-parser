import React from "react";
import { Link } from "react-router-dom";

const PlayerTabs = ({ id }) => (
  <div className="player-tabs">
    <Link to={`/players/${id}/overview`}>Overview</Link>
    <Link to={`/players/${id}/weapons`}>Weapons</Link>
    <Link to={`/players/${id}/heatmap`}>Heatmap</Link>
  </div>
);

export default PlayerTabs;