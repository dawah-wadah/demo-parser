import React from "react";

const tableRow = ({ player, callback }) => {
  if (player.steamInfo) {
    var iconStyle = {
      width: "50px",
      height: "50px",
      borderRadius: "4px",
      backgroundSize: "contain",
      backgroundImage: "url(" + player.steamInfo.imageFull + ")"
    };
    return (
      <div key={player.steamInfo.id} className="table-row">
        <div className="user-info">
          <div className="profile-image" style={iconStyle} />
          <div className="vert-line" />
          <div className="profile-name">{player.steamInfo.name}</div>
        </div>

      </div>
    );
  } else {
    return null;
  }
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
