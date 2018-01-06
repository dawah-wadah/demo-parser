import React from "react";
import { NavLink } from "react-router-dom";

const PlayerTabs = ({ id }) => (
  <nav className="player-tabs">
    <NavLink to={`/players/${id}/overview`} activeClassName="active">
      Overview
    </NavLink>
    <NavLink to={`/players/${id}/weapons`} activeClassName="active">
      Weapons
    </NavLink>
    <NavLink to={`/players/${id}/heatmap`} activeClassName="active">
      Heatmap
    </NavLink>
  </nav>
);

export default PlayerTabs;
