import React from "react";
import { NavLink } from "react-router-dom";

const PlayerTabs = ({ id }) => (
  <div className="player-tabs">
    <div className="navbar-wrapper">
      <NavLink to={`/players/${id}/overview`} activeClassName="active">
        overview
      </NavLink>
      <NavLink to={`/players/${id}/weapons`} activeClassName="active">
        weapons
      </NavLink>
      <NavLink to={`/players/${id}/heatmap`} activeClassName="active">
        heatmap
      </NavLink>
    </div>
  </div>
);

export default PlayerTabs;
