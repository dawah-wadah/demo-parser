import React, { Component } from "react";
import {values, capitalize} from 'lodash'
import RecentGame from './recent_game'
import MapTile from './map_tile'

const newMap = string => ({
  name: capitalize(string.split("_")[1]),
  code: string,
  timesPlayed: 0
});

const Overview = ({ player }) => {
  let games = player.games;
  let weapons = player["Weapons Data"];
  let recentGame = values(games)[0];
  let maps = {};

  // I'm adding dummy data, in case player hasn't played 6 maps legitimately 
  [
    "de_cbble",
    "de_stmarc",
    "de_inferno",
    "de_lake",
    "de_nuke",
    "de_overpass"
  ].forEach(name => {
    if (!maps[name]) {
      maps[name] = newMap(name);
    }
  });

  values(games).forEach(game => {
    if (!maps[game.Map]) {
      debugger;
      maps[game.Map] = newMap(game.Map);
    }
    maps[game.Map].timesPlayed++;
  });

  let mapTiles = values(maps)
    .sort((a, b) => b.timesPlayed - a.timesPlayed)
    .map(mapData => MapTile(mapData));

  let gameTile = RecentGame(recentGame, weapons);
//   return (
//     <div className="player-overview">
//       <table className="player-overview-table">
//         <tbody>
//           <tr>
//             <th className="col">Recent Game</th>
//             <th className="col">Favorite Map</th>
//             <th className="col">Favorite Map</th>
//           </tr>
//           <tr>
//             <td>
//               <div>{gameTile}</div>
//             </td>
//             <td className="col">
//               <div className="map-tiles">{mapTiles}</div>
//             </td>
//             <td className="col">
//               <div className="map-tiles">{mapTiles}</div>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
return(
    <Panel title={"Favorite Map"} elements={mapTiles}/>
)
};

export default Overview;
