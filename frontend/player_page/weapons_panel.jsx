import React, { Component } from "react";
import { values } from "lodash";

const processWeapon = (name, weapons) => {
    let hitGroups = {
        head: 0,
        "left-arm": 0,
        "left-leg": 0,
        "right-arm": 0,
        "right-leg": 0,
        torso: 0,
        total: 0
    };
    let damageDone = 0;
    let shotsFired = 0;
    let totalHits = 0;

    values(weapons[name]).forEach(game => {
        damageDone += game.damage_dealt;
        shotsFired += game.totalShots;
        totalHits += game.totalHits;

        Object.keys(game.hitGroups).forEach(limb => {
            hitGroups[limb] += game.hitGroups[limb];
        });
    });

    return {
        name,
        hitGroups,
        damageDone,
        shotsFired,
        totalHits
    };
};

const processData = weapons => {
  let guns = Object.keys(weapons).map(name =>
    processWeapon(name, weapons)
  );

  return guns.sort((a, b) => b.shotsFired - a.shotsFired);
};
const WeaponPanel = weapons => {
    const guns = processData(weapons).slice(0,5);
    const tiles = guns.map(gun => WeaponTile(gun));
    return tiles;
};

export default WeaponPanel;

const WeaponTile = weapon => (
  <div className="map-tile" key={weapon.name}>
    <div className="map-image">
      <img src={"assets/weapons_png/" + weapon.name + ".png"} />
      <div className="map-info">
        <div className="map-info-tags">
          <span id="map-name">{weapon.name.toUpperCase()}</span>
        </div>
        <div className="map-info-tags">
          <span>Fired: {weapon.shotsFired}</span>
          <img className="map-info-img" src={`assets/weapons/crosshair.svg`} />
        </div>
      </div>
    </div>
  </div>
);
