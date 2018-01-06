import React from "react";
import { values } from "lodash";

const RecentGame = (gameData, weapons) => {
  let usage = {};
  values(gameData.kills).forEach(kill => {
    if (!usage[kill.weapon]) {
      usage[kill.weapon] = {
        kills: 0,
        name: kill.weapon
      };
    }
    usage[kill.weapon].kills++;
  });

  let kills = (
    <div className="weapon-data-foo">
      <span>Kills</span>
      <span>{gameData.K}</span>
    </div>
  );
  let deaths = (
    <div className="weapon-data-foo">
      <span>Deaths</span>
      <span>{gameData.D}</span>
    </div>
  );
  let kd = (
    <div className="weapon-data-foo">
      <span>K/D</span>
      <span>{(gameData.K / gameData.D).toFixed(2)}</span>
    </div>
  );
  let assists = (
    <div className="weapon-data-foo">
      <span>Assists</span>
      <span>{gameData.A}</span>
    </div>
  );

  let mostUsedWeapon = values(usage)
    .map(el => el)
    .sort((a, b) => b.kills - a.kills)[0];

  let mostUsedWeaponData = values(weapons[mostUsedWeapon.name]);

  let stats = mostUsedWeaponData[mostUsedWeaponData.length - 1];

  let gun = (
    <div className="panel-tile">
      <div className="player-outcome">Outcome: {gameData.Win}</div>
      <div>
        <div>Best Weapon:</div>
        <div className="weapon-img">
          <img src={`assets/weapons/weapon_` + mostUsedWeapon.name + `.svg`} />
        </div>
        <div className="tile-footer">
          <div className="left-side">
            <span>{mostUsedWeapon.name.toUpperCase()}</span>
          </div>
          <div className="right-side">
            <span>{mostUsedWeapon.kills}</span>
            <img src={`assets/weapons/crosshair.svg`} />
            <span>{stats.accuracy + "%"} </span>
            <img src={`assets/weapons/bullseye.svg`} />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="player-recent-panel">
      <Cell data={gun} />
      <Cell data={kd} />
      <Cell data={kills} />
      <Cell data={deaths} />
      <Cell data={assists} />
    </div>
  );
};

export default RecentGame;

const Cell = ({ data }) => <div className="tab">{data}</div>;
