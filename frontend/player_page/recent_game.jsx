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

  let win = {
    backgroundColor: "rgba(131, 198, 72, 0.1)",
    borderColor: "rgba(131, 198, 72, 0.9)",
    color: "rgba(131, 198, 72, 0.9)"
  };

  let loss = {
    backgroundColor: "rgba(228, 82, 75, 0.1)",
    borderColor: "rgba(228, 82, 75, 0.9)",
    color: "rgba(228, 82, 75, 0.9)"
  };

  let draw = {
    backgroundColor: "rgba(191, 147, 41, 0.1)",
    borderColor: "rgba(191, 147, 41, 0.9)",
    color: "rgba(191, 147, 41, 0.9)"
  };

  let styling;

  switch (gameData.Win) {
    case true:
      styling = win;
      break;
    case false:
      styling = loss;
      break;
    default:
      styling = draw;
      break;
  }

  let gun = (
    <div className="panel-tile">
      <div className="player-outcome" style={styling}>
        Outcome: {gameData.Win}
      </div>
        <div>Best Weapon</div>
        <div className="weapon-img">
          <img src={`assets/weapons/weapon_` + mostUsedWeapon.name + `.svg`} />
        </div>
        <div className="tile-footer">
          <div className="left-side">
            <span>{mostUsedWeapon.name.toUpperCase()}</span>
          </div>
          <div className="right-side">
            <span>{mostUsedWeapon.kills}</span>
            <div className="shots-fired-img w-stats-img" />
            <span>{stats.accuracy + "%"} </span>
            <div className="accuracy-img w-stats-img" />
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
