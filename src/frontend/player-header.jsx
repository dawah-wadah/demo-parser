import React from "react";
import { Link } from "react-router-dom";

const PlayerHeader = ({ steamInfo }) => (
  <div className="player-header">
    <div className="player-header-image">
      <img src={steamInfo.imageFull} />
    </div>
    <div className="player-info">
      <div className="player-header-name"><Link to={`/players/${steamInfo.id}`}>{steamInfo.name}</Link></div>
      <a className="player-steam" href={`https://steamcommunity.com/profiles/${steamInfo.id}`}>
        <div className="steam-logo" />
      </a>
    </div>
  </div>
);

export default PlayerHeader;
