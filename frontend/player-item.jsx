import React from "react";
import { Link } from 'react-router-dom';

const PlayerItem = ({ player, callback }) => {
  if (!player.steamInfo) return null;

    return (
      <Link to={`/players/${player.steamInfo.id}`} className="table-row">
        <div className="profile-image">
          <img src={player.steamInfo.imageFull} />
        </div>
        <div className="profile-name">{player.steamInfo.name}</div>
      </Link>
    );

};
export default PlayerItem;
