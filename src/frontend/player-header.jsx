import React from "react";

const PlayerHeader = ({ steamInfo }) => (
  <div className="player-header">
    <div className="player-header-image">
      <img src={steamInfo.imageFull} />
    </div>
    <div className="player-info">
      <div className="player-header-name">{steamInfo.name}</div>
      <a className="player-steam" href={`https://steamcommunity.com/profiles/${steamInfo.id}`}>
        <div className="steam-logo" />
      </a>
    </div>
  </div>
);

export default PlayerHeader;
