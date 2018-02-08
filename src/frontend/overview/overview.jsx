import React from "react";
import { values, capitalize } from "lodash";

import Panel from "./panel";
import MapTile from "./map-tile";
import RecentGame from "./recent-game";
import Weapons from "./weapons-panel";

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
      maps[game.Map] = newMap(game.Map);
    }
    maps[game.Map].timesPlayed++;
  });

  let mapTiles = values(maps)
    .sort((a, b) => b.timesPlayed - a.timesPlayed)
    .map(mapData => MapTile(mapData));

  let gameTile = RecentGame(recentGame, weapons);
  let weaponTiles = Weapons(weapons)
  return (
    <div className="player-overview">
      <Panel title={"Favorite Map"} elements={mapTiles} />
      <Panel title={"Recent Game"} elements={gameTile} />
      <Panel title={"Favorite Weapon"} elements={weaponTiles} />
    </div>
  );
};

export default Overview;
