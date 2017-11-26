const fs = require("fs");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");
const ProgressBar = require("ascii-progress");
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

function storeData(attacker, victim, status, map) {
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
    }
  };

  if (status === "kills") {
    firebase
      .database()
      .ref(
        "/" +
          attacker.name +
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
        "/" + victim.name + "/" + map + "/" + victim.side + "/" + status + "/"
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
      accuracy: (weaponsData[weapon].shots_hit /
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

function hasKilled(victim, attacker, map, ...playerID) {
  playerID.forEach(id => {
    if (attacker.steam64Id == id) {
      storeData(attacker, victim, "kills", map);
    }
  });
}

function wasKilled(victim, attacker, map, ...playerID) {
  playerID.forEach(id => {
    if (victim.steam64Id == id) {
      storeData(attacker, victim, "deaths", map);
    }
  });
}

function storeGrenadeData(evt) {
  // if (globalData.grenades.dust_2[evt.name] === undefined) {
  //   globalData.grenades.dust_2[evt.name] = {};
  // }
  let location = { x: evt.x, y: evt.y };
  // globalData.grenades.dust_2[evt.name][counter] = location;
  firebase
    .database()
    .ref("/grenades/de_dust2/" + evt.name + "/")
    .push(location);
  counter++;
}

function updateProgress(bar, demoFile) {
  bar.current = demoFile.currentTick;
  bar.tick();
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
    headshots: 0
  };
}

function newGame() {
  return {
    wadah: {},
    vlad: {}
  };
}

/*
player {
  map: {
    weapons: {
      weapon_name: {
        shots_fired: INT,
        shots_hit: INT,
        headshots: INT
      }
    },
    tSide: {
      kills: {},
      deaths:{},
    },
    ctSide: {
      kills: {},
      deaths:{},
    }
  }
}


*/

function weaponStats(weapon, player) {}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    let map;
    let percentage = 0;
    let bar = new ProgressBar({
      schema:
        ` [:bar.` +
        randomColor() +
        `] :current/:total :percent :elapseds :etas`,
      total: 10
    });

    var demoFile = new demo.DemoFile();
    demoFile.on("start", () => {
      map = demoFile.header.mapName;
      bar.total = demoFile.header.playbackTicks;
      console.log("Loaded " + file);
    });

    demoFile.on("end", () => {
      // updateProgress(bar, demoFile);
      console.log("Finished with " + file);
      Promise.all([
        storeShots("Taylor Swift", shots.wadah),
        storeShots("hlebopek", shots.vlad)
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
        // updateProgress(bar, demoFile);
      });
    });

    demoFile.gameEvents.on("player_death", e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        hasKilled(victim, attacker, map, 76561198027906568, 76561198171618625);
        wasKilled(victim, attacker, map, 76561198027906568, 76561198171618625);
      }
      // updateProgress(bar, demoFile);
    });

    demoFile.gameEvents.on("weapon_fire", e => {
      let playa = demoFile.entities.getByUserId(e.userid);
      // let updatable = bar.current / bar.total * 100 > 97;
      if (!playa) {
        return;
      }
      let weapon = e.weapon.split("_")[1];
      if (playa.steam64Id == 76561198027906568) {
        if (!shots.wadah[weapon]) {
          shots.wadah[weapon] = newWeapon();
        }
        shots.wadah[weapon].shots_fired++;
      } else if (playa.steam64Id == 76561198171618625) {
        if (!shots.vlad[weapon]) {
          shots.vlad[weapon] = newWeapon();
        }
        shots.vlad[weapon].shots_fired++;
      }

      // updateProgress(bar, demoFile);
    });

    demoFile.gameEvents.on("player_hurt", e => {
      let playa = demoFile.entities.getByUserId(e.attacker);
      if (!playa) {
        return;
      }
      if (playa.steam64Id == 76561198027906568) {
        if (!shots.wadah[e.weapon]) {
          shots.wadah[e.weapon] = newWeapon();
        }
        shots.wadah[e.weapon].shots_hit++;
        if (e.hitgroup === 1 && e.health === 0) {
          shots.wadah[e.weapon].headshots++;
        }
      } else if (playa.steam64Id == 76561198171618625) {
        if (!shots.vlad[e.weapon]) {
          shots.vlad[e.weapon] = newWeapon();
        }
        shots.vlad[e.weapon].shots_hit++;
        if (e.hitgroup === 1 && e.health === 0) {
          shots.vlad[e.weapon].headshots++;
        }
      }
    });

    demoFile.parse(buffer);
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

  // store data locally

  // Promise.all(promises).then(() =>
  //   fs.writeFile("./data.json", JSON.stringify(globalData), "utf8")
  // );
});
