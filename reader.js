const fs = require("fs");
const mover = require("fs-extra");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");
const firebase = require("firebase");
const initializeFB = require("./base.js");

const defaultMapData = () => ({
  Terrorist: { kills: {}, deaths: {} },
  "Counter-Terrorist": { kills: {}, deaths: {} }
});

let globalData = {
  kills: {
    "Taylor Swift": { dust_2: defaultMapData() },
    hlebopek: { dust_2: defaultMapData() }
  },
  grenades: { dust_2: {} }
};
let counter = 1;

function storeData(attacker, victim, status, map, weapon) {
  let killData = {
    killer: attacker.name,
    victim: victim.name,
    location: {
      victim: {
        x: victim.position.x,
        y: victim.position.y
      },
      killer: {
        x: attacker.position.x,
        y: attacker.position.y
      }
    },
    weapon: weapon
  };

  if (status === "kills") {
    firebase
      .database()
      .ref(
        "/" +
          attacker.steam64Id +
          "/" +
          map +
          "/" +
          attacker.side +
          "/" +
          status +
          "/"
      )
      .push(killData);
  } else {
    firebase
      .database()
      .ref(
        "/" +
          victim.steam64Id +
          "/" +
          map +
          "/" +
          victim.side +
          "/" +
          status +
          "/"
      )
      .push(killData);
  }

  counter++;
}

function storeShots(playerName, weaponsData) {
  let promises = [];

  Object.keys(weaponsData).forEach(weapon => {
    let data = {
      totalShots: weaponsData[weapon].shots_fired,
      headshots: weaponsData[weapon].headshots,
      totalHits: weaponsData[weapon].shots_hit,
      accuracy: (
        weaponsData[weapon].shots_hit /
        weaponsData[weapon].shots_fired *
        100
      ).toFixed(2)
    };

    promises.push(
      new Promise(function(resolve, reject) {
        firebase
          .database()
          .ref(`/${playerName}/Weapons Data/${weapon}`)
          .push(data)
          .then(() => resolve(), () => reject());
      })
    );
  });

  return Promise.all(promises).then(() => {
    return;
  });
}

function hasKilled(victim, attacker, weapon, map) {
  storeData(attacker, victim, "kills", map, weapon);
}

function wasKilled(victim, attacker, weapon, map) {
  storeData(attacker, victim, "deaths", map, weapon);
}

function storeGrenadeData(evt) {
  let location = { x: evt.x, y: evt.y };
  firebase
    .database()
    .ref("/grenades/de_dust2/" + evt.name + "/")
    .push(location);
  counter++;
}

function randomColor() {
  let colors = "red cyan blue grey white black green yellow magenta brightRed brightBlue brightCyan brightWhite brightBlack brightGreen brightYellow brightMagenta".split(
    " "
  );
  return colors[Math.floor(Math.random() * colors.length)];
}

function newWeapon() {
  return {
    shots_fired: 0,
    shots_hit: 0,
    headshots: 0,
    damage_dealt: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0
  };
}

function newGame() {
  return {
    wadah: {},
    vlad: {}
  };
}

function weaponStats(weapon, player) {}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    let map;
    var demoFile = new demo.DemoFile();
    demoFile.on("start", () => {
      map = demoFile.header.mapName;
      console.log("Loaded " + file);
    });

    demoFile.on("end", () => {
      console.log("Finished with " + file);
      Promise.all([
        storeShots("76561198027906568", shots.wadah),
        storeShots("76561198171618625", shots.vlad)
      ]).then(() => {
        return callback();
      });
    });

    let grenades = [
      "hegrenade",
      "flashbang",
      "smokegrenade",
      "molotov",
      "decoy"
    ];

    let shots = newGame();

    grenades.forEach(grenade => {
      demoFile.gameEvents.on(`${grenade}_detonate`, e => {
        switch (grenade) {
          case "hegrenade":
            e.name = "High Explosive Grenade";
            break;
          case "flashbang":
            e.name = "Flashbang";
            break;
          case "smokegrenade":
            e.name = "Smoke Grenade";
            break;
          case "molotov":
            e.name = "Molotov";
            break;
          case "decoy":
            e.name = "Decoy";
            break;
          default:
        }
        storeGrenadeData(e);
      });
    });

    demoFile.gameEvents.on("player_death", e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);

      let killerWeapon = e.weapon.split("_")[0];

      if (victim && attacker) {
        hasKilled(
          victim,
          attacker,
          killerWeapon,
          map
        );
        wasKilled(
          victim,
          attacker,
          killerWeapon,
          map
        );
      }
    });

    demoFile.gameEvents.on("weapon_fire", e => {
      let playerID = demoFile.entities.getByUserId(e.userid);
      if (!playerID) {
        return;
      }
      let weapon = e.weapon.split("_")[1];
      if (!shots[playerID][weapon]) {
        shots[playerID][weapon] = newWeapon();
      }
      shots[playerID][weapon].shots_fired++;
    });

    demoFile.gameEvents.on("player_hurt", e => {
      let playerID = demoFile.entities.getByUserId(e.attacker);
      if (!playerID) {
        return;
      }
      if (!shots[playerID][e.weapon]) {
        shots[playerID][e.weapon] = newWeapon();
      }
      shots[playerID][e.weapon].shots_hit++;
      shots[playerID][e.weapon][e.hitgroup]++;
      shots[playerID][e.weapon][damage_dealt] += e.dmg_health;
      shots[playerID][e.weapon][damage_dealt] += e.dmg_armor;
      if (e.hitgroup === 1 && e.health === 0) {
        shots[playerID][e.weapon].headshots++;
      }
    });
    try {
      demoFile.parse(buffer);
    } catch (error) {
      console.log("Skipping file, unreadable section");
    }
  });
}

fs.readdir(dir, function(err, items) {
  let promises = [];
  initializeFB();
  for (var i = 0; i < items.length; i++) {
    promises.push(
      new Promise(function(resolve, reject) {
        parseDemofile(`./demos/${items[i]}`, resolve);
      })
    );
  }

  Promise.all(promises).then(() => {
    // closes the firebase connection
    firebase.database().goOffline();
  });
});
