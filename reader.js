const fs = require("fs");
const mover = require("fs-extra");
const assert = require("assert");
const APIKeys = require("./keys.json");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");
const firebase = require("firebase");
const initializeFB = require("./base.js");
const fetch = require("node-fetch");

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

const fetchSteamProfiles = playerID => {
  let url =
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?" +
    "key=" +
    APIKeys.steamKey +
    "&steamids=" +
    playerID;
  fetch(url)
    .then(results => results.json())
    .then(data => {
      let shit = data.response.players;
      shit.forEach(player => {
        let id = player.steamid;
        firebase
          .database()
          .ref("/")
          .update({
            [id + `/steamInfo/name`]: player.personaname,
            [id + `/steamInfo/imageFull`]: player.avatarfull,
            [id + `/steamInfo/imageMed`]: player.avatarmedium,
            [id + `/steamInfo/imageSmall`]: player.avatar,
            [id + `/steamInfo/id`]: player.steamid,
            [id + `/steamInfo/profile`]: player.profileurl
          });
      });
    })
    .catch(err => console.log(err.message));
};

function storeData(attacker, victim, status, map, weapon, gameID) {
  let killData = {
    killer: attacker.name,
    killerID: attacker.steam64Id,
    victim: victim.name,
    victimID: victim.steam64Id,
    location: {
      victim: {
        x: victim.position.x,
        y: victim.position.y,
        theta: victim.eyeAngles.yaw
      },
      killer: {
        x: attacker.position.x,
        y: attacker.position.y,
        theta: attacker.eyeAngles.yaw
      }
    },
    weapon: weapon
  };
  let playerID = victim.steam64Id;
  let playerSide = victim.side;

  if (status === "kills") {
    playerID = attacker.steam64Id;
    playerSide = attacker.side;
  }

  firebase
    .database()
    .ref("/" + playerID + "/")
    .once("value", snap => {
      if (!snap.hasChild("steamInfo")) {
        fetchSteamProfiles(playerID);
      }
    });
  let playerURL = "/" + playerID + "/games/" + gameID + "/";
  let Team = playerSide;
  firebase
    .database()
    .ref(playerURL)
    .update({ Map: map, Team });
  firebase
    .database()
    .ref(playerURL + "/" + status + "/")
    .push(killData);
  counter++;
}

function storeShots(playerName, weaponsData) {
  let promises = [];
  Object.keys(weaponsData).forEach(weapon => {
    let data = {
      totalShots: weaponsData[weapon].shots_fired,
      damage_dealt: weaponsData[weapon].damage_dealt,
      hitGroups: {
        head: weaponsData[weapon]["head"],
        torso: weaponsData[weapon]["torso"],
        "left-arm": weaponsData[weapon]["left-arm"],
        "right-arm": weaponsData[weapon]["right-arm"],
        "left-leg": weaponsData[weapon]["left-leg"],
        "right-leg": weaponsData[weapon]["right-leg"]
      },
      headShots: weaponsData[weapon].headshots,
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

function hasKilled(victim, attacker, weapon, map, gameID) {
  storeData(attacker, victim, "kills", map, weapon, gameID);
}

function wasKilled(victim, attacker, weapon, map, gameID) {
  storeData(attacker, victim, "deaths", map, weapon, gameID);
}

function storeGrenadeData(evt) {
  let location = { x: evt.x, y: evt.y };
  firebase
    .database()
    .ref("/grenades/de_dust2/" + evt.name + "/")
    .push(location);
  counter++;
}

function newWeapon() {
  return {
    shots_fired: 0,
    shots_hit: 0,
    headshots: 0,
    damage_dealt: 0,
    head: 0,
    torso: 0,
    "left-arm": 0,
    "right-arm": 0,
    "left-leg": 0,
    "right-leg": 0
  };
}

// 1=hs 2=upper torso 3=lower torso 4=left arm 5=right arm 6=left leg 7=right leg

function whereHit(num) {
  switch (num) {
    case 1:
      return "head";
    case 2:
      return "torso";
    case 3:
      return "torso";
    case 4:
      return "left-arm";
    case 5:
      return "right-arm";
    case 6:
      return "left-leg";
    case 7:
      return "right-leg";

    default:
      break;
  }
}

function weaponStats(weapon, player) {}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    let map;
    let gameID = `${file}`.split("./demos/")[1].split(".dem")[0];
    var demoFile = new demo.DemoFile();
    demoFile.on("start", () => {
      debugger;
      map = demoFile.header.mapName;
      console.log("Loaded " + file);
    });

    demoFile.on("end", () => {
      console.log("Finished with " + file);
      let promises = [];

      Object.keys(shots).forEach(key => {
        promises.push(storeShots(key, shots[key]));
      });
      Promise.all(promises).then(() => {
        return callback();
      });
      let teams = demoFile.teams;
      let ts = teams[demo.TEAM_TERRORISTS];
      let cts = teams[demo.TEAM_CTS];
      let foo = {};
      if (demoFile.gameRules.phase == "postgame") {
        let winners;
        let losers;
        if (ts.score > cts.score) {
          winners = ts;
          losers = cts;
        } else {
          winners = cts;
          losers = ts;
        }
        winners.members.forEach(player => {
          if (player) {
            return (foo[
              player.steam64Id + `/games/` + gameID + "/" + "Win"
            ] = true);
          }
        });
        losers.members.forEach(player => {
          if (player) {
            return (foo[
              player.steam64Id + `/games/` + gameID + "/" + "Win"
            ] = false);
          }
        });
      } else {
        let players = ts.members.concat(cts.members);
        players.forEach(player => {
          if (player) {
            return (foo[
              player.steam64Id + `/games/` + gameID + "/" + "Win"
            ] = "Demo Ended before Game Ended");
          }
        });
        console.log("Wadah left the game too early");
      }
      firebase
        .database()
        .ref("/")
        .update(foo);
    });

    let grenades = [
      "hegrenade",
      "flashbang",
      "smokegrenade",
      "molotov",
      "decoy"
    ];

    let shots = {};

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
        hasKilled(victim, attacker, killerWeapon, map, gameID);
        wasKilled(victim, attacker, killerWeapon, map, gameID);
      }
    });

    demoFile.gameEvents.on("weapon_fire", e => {
      let player = demoFile.entities.getByUserId(e.userid);
      if (!player) {
        return;
      }
      let playerID = player.steam64Id;
      let weapon = e.weapon.split("_")[1];
      if (!shots[playerID]) {
        shots[playerID] = {};
      }
      if (!shots[playerID][weapon]) {
        shots[playerID][weapon] = newWeapon();
      }
      shots[playerID][weapon].shots_fired++;
    });

    demoFile.gameEvents.on("player_hurt", e => {
      let player = demoFile.entities.getByUserId(e.attacker);
      if (!player) {
        return;
      }
      let playerID = player.steam64Id;
      if (!shots[playerID]) {
        shots[playerID] = {};
      }
      if (!shots[playerID][e.weapon]) {
        shots[playerID][e.weapon] = newWeapon();
      }
      shots[playerID][e.weapon].shots_hit++;
      shots[playerID][e.weapon][whereHit(e.hitgroup)]++;
      shots[playerID][e.weapon].damage_dealt += e.dmg_health;
      shots[playerID][e.weapon].damage_dealt += e.dmg_armor;
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
