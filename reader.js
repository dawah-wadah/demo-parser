const fs = require("fs");
const assert = require("assert");
const APIKeys = require("./keys.json");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");
const firebase = require("firebase");
const initializeFB = require("./base.js");
const fetch = require("node-fetch");
const utils = require("./utils.js");

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

function storeData(victim, attacker, weapon, map, gameID) {
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
    weapon
  };

  firebase
    .database()
    .ref("/" + attacker.steam64Id + "/")
    .once("value", snap => {
      if (!snap.hasChild("steamInfo")) {
        fetchSteamProfiles(attacker.steam64Id);
      }
    });
  firebase
    .database()
    .ref("/" + victim.steam64Id + "/")
    .once("value", snap => {
      if (!snap.hasChild("steamInfo")) {
        fetchSteamProfiles(victim.steam64Id);
      }
    });

  let newKDKey = firebase
    .database()
    .ref("/" + attacker.steam64Id + "/games/" + gameID + "/kills")
    .push().key;

  let deaths = {};
  deaths[
    attacker.steam64Id + "/games/" + gameID + "/kills/" + newKDKey
  ] = killData;
  deaths[
    victim.steam64Id + "/games/" + gameID + "/deaths/" + newKDKey
  ] = killData;
  deaths[attacker.steam64Id + "/games/" + gameID + "/Map"] = map;
  deaths[victim.steam64Id + "/games/" + gameID + "/Map"] = map;
  deaths[attacker.steam64Id + "/games/" + gameID + "/Team"] = attacker.side;
  deaths[victim.steam64Id + "/games/" + gameID + "/Team"] = victim.side;
  return firebase
    .database()
    .ref("/")
    .update(deaths);
}

function storeShots(playerName, weaponsData, gameKey) {
  let foo = {};
  Object.keys(weaponsData).forEach(weapon => {
    let data = weaponsData[weapon];
    data.accuracy = (
      weaponsData[weapon].totalHits /
      weaponsData[weapon].totalShots *
      100
    ).toFixed(2);

    foo[playerName + "/Weapons Data/" + weapon + "/" + gameKey + "/"] = data;

  });
  return firebase
    .database()
    .ref(`/`)
    .update(foo);
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

function weaponStats(weapon, player) {}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    let map;
    let gameID = `${file}`.split("./demos/")[1].split(".dem")[0];
    var demoFile = new demo.DemoFile();

    let player_roster = {
      round: 0,
      players: {}
    };

    demoFile.on("start", () => {
      map = demoFile.header.mapName;
      console.log("Loaded " + file);
    });

    demoFile.on("end", () => {
      console.log("Finished with " + file);
      let promises = [];

      let gameKey = firebase.database().ref("/logs/").push().key

      Object.keys(shots).forEach(key => {
        promises.push(storeShots(key, shots[key], gameKey));
      });
      Promise.all(promises).then(() => {
        return callback();
      });
      let ts = demoFile.teams[demo.TEAM_TERRORISTS];
      let cts = demoFile.teams[demo.TEAM_CTS];
      let foo = {};
      let winners = cts;
      let losers = ts;
      if (ts.score > cts.score) {
        winners = ts;
        losers = cts;
      }
      winners.members.forEach(player => {
        if (player) {
          foo[player.steam64Id + `/games/` + gameID + "/" + "Win"] = true;
        }
      });
      losers.members.forEach(player => {
        if (player) {
          foo[player.steam64Id + `/games/` + gameID + "/" + "Win"] = false;
        }
      });
      let players = ts.members.concat(cts.members);
      players.forEach(player => {
        if (player) {
          foo[player.steam64Id + `/games/` + gameID + "/" + "K"] = player.kills;
          foo[player.steam64Id + `/games/` + gameID + "/" + "D"] =
            player.deaths;
          foo[player.steam64Id + `/games/` + gameID + "/" + "A"] =
            player.assists;
        }
      });
      firebase
        .database()
        .ref("/")
        .update(foo);
    });

    let grenades = utils.grenades();

    let shots = {};

    grenades.forEach(grenade => {
      demoFile.gameEvents.on(`${grenade}_detonate`, e => {
        e.name = utils.getGrenadeName(grenade)
        storeGrenadeData(e);
      });
    });

    demoFile.gameEvents.on("round_start", () => {
      let teams = demoFile.teams;
      let ts = teams[demo.TEAM_TERRORISTS];
      let cts = teams[demo.TEAM_CTS];
      let players = ts.members.concat(cts.members);

      player_roster.round = demoFile.gameRules.roundNumber;

      players.forEach(player => {
        if (!player) {
          return;
        }
        player_roster.players[player.steam64Id] = true;
      });
    });

    demoFile.gameEvents.on("player_death", e => {
      // if (demoFile.gameRules.roundNumber < 1) {
      //   return;
      // }

      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);

      let killerWeapon = e.weapon.split("_")[0];

      if (victim && attacker) {
        if (!player_roster.players[victim.steam64Id]) {
          return;
        }
        if (killerWeapon == "world") {
          return;
        }
        storeData(victim, attacker, killerWeapon, map, gameID);
        player_roster.players[victim.steam64Id] = false;
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
        shots[playerID][weapon] = utils.newWeapon();
      }
      shots[playerID][weapon].totalShots++;
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
        shots[playerID][e.weapon] = utils.newWeapon();
      }
      shots[playerID][e.weapon].totalHits++;
      shots[playerID][e.weapon].hitGroups[utils.whereHit(e.hitgroup)]++;
      shots[playerID][e.weapon].damageDealt += e.dmg_health;
      shots[playerID][e.weapon].damageDealt += e.dmg_armor;
      if (e.hitgroup === 1 && e.health === 0) {
        shots[playerID][e.weapon].headShots++;
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
