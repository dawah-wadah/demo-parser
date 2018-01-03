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

//
// <div className="checkboxes">
//   <input
//     type="checkbox"
//     className="checkbox"
//     value={`${player.steamInfo.id} Counter-Terrorist kills`}
//     onClick={callback}
//   />
//   <div className="vert-line" />
//   <input
//     type="checkbox"
//     className="checkbox"
//     value={`${player.steamInfo.id} Counter-Terrorist deaths`}
//     onClick={callback}
//   />
//   <div className="vert-line" />
//   <input
//     type="checkbox"
//     className="checkbox"
//     value={`${player.steamInfo.id} Terrorist kills`}
//     onClick={callback}
//   />
//   <div className="vert-line" />
//   <input
//     type="checkbox"
//     className="checkbox"
//     value={`${player.steamInfo.id} Terrorist deaths`}
//     onClick={callback}
//   />
// </div>
