import React from "react";
import { Link } from 'react-router-dom';

const tableRow = ({ player, callback }) => {
  if (!player.steamInfo) return null;
  // if (player.steamInfo) {
  //   var iconStyle = {
  //     width: "50px",
  //     height: "50px",
  //     borderRadius: "4px",
  //     backgroundSize: "contain",
  //     backgroundImage: "url(" + player.steamInfo.imageFull + ")"
  //   };
    return (
      <Link to={`/players/${player.steamInfo.name}`} className="table-row">
        <div className="profile-image">
          <img src={player.steamInfo.imageFull} />
        </div>
        <div className="profile-name">{player.steamInfo.name}</div>
      </Link>
    );

};
export default tableRow;

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
