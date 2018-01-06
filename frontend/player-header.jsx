import React from "react";

const PlayerHeader = ({ steamInfo }) => (
  <div className="player-header">
    <div
      className="player-header-image"
      style={{ backgroundImage: `url(${steamInfo.imageFull})` }}
    />
    <div className="player-info">
      <div className="player-header-name">{steamInfo.name}</div>
    </div>
  </div>
);

export default PlayerHeader;
