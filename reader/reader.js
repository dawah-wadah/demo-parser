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
const _ = require("lodash");

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

const fetchSteamProfiles = (playerID, obj) => {
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
        obj["players/" + id + `/steamInfo/name`] = player.personaname;
        obj["players/" + id + `/steamInfo/imageFull`] = player.avatarfull;
        obj["players/" + id + `/steamInfo/imageMed`] = player.avatarmedium;
        obj["players/" + id + `/steamInfo/imageSmall`] = player.avatar;
        obj["players/" + id + `/steamInfo/id`] = player.steamid;
        obj["players/" + id + `/steamInfo/profile`] = player.profileurl;
      });
    })
    .catch(err => console.log(err.message));
};

function storeData(victim, attacker, weapon, map, gameKey, obj) {
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
    .ref("/")
    .once("value", snap => {
      if (!snap.hasChild(`${attacker.steam64Id}/steamInfo`)) {
        fetchSteamProfiles(attacker.steam64Id, obj);
      }
      if (!snap.hasChild(`${victim.steam64Id}/steamInfo`)) {
        fetchSteamProfiles(victim.steam64Id, obj);
      }
    });

  let url = "/games/" + gameKey;

  let newKDKey = firebase
    .database()
    .ref("/" + attacker.steam64Id + url + "/kills")
    .push().key;

  let deaths = {};
  obj["players/" + attacker.steam64Id + url + "/kills/" + newKDKey] = killData;
  obj["players/" + victim.steam64Id + url + "/deaths/" + newKDKey] = killData;
  obj["players/" + attacker.steam64Id + url + "/Map"] = map;
  obj["players/" + victim.steam64Id + url + "/Map"] = map;
  obj["players/" + attacker.steam64Id + url + "/Team"] = attacker.side;
  obj["players/" + victim.steam64Id + url + "/Team"] = victim.side;
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

function storeGrenadeData(evt, gameKey, map) {
  let location = { x: evt.x, y: evt.y };
  firebase
    .database()
    .ref(`/grenades/${gameKey}/${map}2/` + evt.name + "/")
    .push(location);
}

function weaponStats(weapon, player) {}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    let shots = {};
    const gameKey = firebase
      .database()
      .ref("/logs/")
      .push().key;
    let map;
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
      let ts = demoFile.teams[demo.TEAM_TERRORISTS];
      let cts = demoFile.teams[demo.TEAM_CTS];
      let foo = { ...shots };
      foo["games/" + gameKey + "/players/"] = _.keys(player_roster.players);
      foo["games/" + gameKey + "/Map/"] = map;
      let winners = cts;
      let losers = ts;
      if (ts.score > cts.score) {
        winners = ts;
        losers = cts;
      }
      winners.members.forEach(player => {
        if (player) {
          foo[
            "players/" + player.steam64Id + `/games/` + gameKey + "/" + "Win"
          ] = true;
        }
      });
      losers.members.forEach(player => {
        if (player) {
          foo[
            "players/" + player.steam64Id + `/games/` + gameKey + "/" + "Win"
          ] = false;
        }
      });
      let players = ts.members.concat(cts.members);
      players.forEach(player => {
        if (player) {
          foo["players/" + player.steam64Id + `/games/` + gameKey + "/" + "K"] =
            player.kills;
          foo["players/" + player.steam64Id + `/games/` + gameKey + "/" + "D"] =
            player.deaths;
          foo["players/" + player.steam64Id + `/games/` + gameKey + "/" + "A"] =
            player.assists;
        }
      });
      firebase
        .database()
        .ref("/")
        .update(foo)
        .then(() => callback());
      // callback()
    });

    let grenades = utils.grenades();

    grenades.forEach(grenade => {
      demoFile.gameEvents.on(`${grenade}_detonate`, e => {
        e.name = utils.getGrenadeName(grenade);
        storeGrenadeData(e, gameKey, map);
      });
    });

    demoFile.gameEvents.on("round_start", () => {
      let teams = demoFile.teams;
      let ts = teams[demo.TEAM_TERRORISTS];
      let cts = teams[demo.TEAM_CTS];
      let players = ts.members.concat(cts.members);

      console.log(demoFile.gameRules.roundNumber);

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
        if (
          !player_roster.players[victim.steam64Id] ||
          killerWeapon == "world"
        ) {
          return;
        }
        storeData(victim, attacker, killerWeapon, map, gameKey, shots);
        player_roster.players[victim.steam64Id] = false;
      }
    });

    demoFile.gameEvents.on("weapon_fire", e => {
      let player = demoFile.entities.getByUserId(e.userid);
      if (!player || !player.steam64Id) {
        return;
      }
      let playerID = player.steam64Id;
      let weapon = e.weapon.split("_")[1];
      let url =
        "/players/" +
        playerID +
        "/Weapons Data/" +
        weapon +
        "/" +
        gameKey +
        "/";
      utils.iterates(shots, url + "totalShots");
    });

    demoFile.gameEvents.on("player_hurt", e => {
      let player = demoFile.entities.getByUserId(e.attacker);
      if (!player || !player.steam64Id) {
        return;
      }
      let playerID = player.steam64Id;
      let url =
        "/players/" +
        playerID +
        "/Weapons Data/" +
        e.weapon +
        "/" +
        gameKey +
        "/";
      utils.iterates(shots, url + "totalHits");
      utils.iterates(shots, url + `hitGroups/${utils.whereHit(e.hitgroup)}`);
      utils.iterates(shots, url + "damageDealt", e.dmg_health);
      utils.iterates(shots, url + "damageDealt", e.dmg_armor);
      if (e.hitgroup === 1 && e.health === 0) {
        utils.iterates(shots, url + "headShots");
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
