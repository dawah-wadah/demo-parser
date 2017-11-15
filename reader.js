const fs = require("fs");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");

let globalData = {
  "Taylor Swift": {
    Terrorist: { kills: {}, deaths: {} },
    "Counter-Terrorist": { kills: {}, deaths: {} }
  },
  hlebopek: {
    Terrorist: { kills: {}, deaths: {} },
    "Counter-Terrorist": { kills: {}, deaths: {} }
  }
};
let counter = 1;

function storeData(attacker, victim, status) {
  let killData = {
    killer: victim.name,
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
  globalData[attacker.name][attacker.side][status][counter] = killData;
  counter++;
}

function hasKilled(victim, attacker, ...playerID) {
  playerID.forEach(id => {
    if (attacker.steam64Id == id) {
      console.log("%s killed %s", attacker.name, victim.name);
      storeData(attacker, victim, "kills");
    }
  });
}
function wasKilled(victim, attacker, ...playerID) {
  playerID.forEach(id => {
    if (victim.steam64Id == id) {
      console.log("%s was killed by %s", victim.name, attacker.name);
      storeData(attacker, victim, "deaths");
    }
  });
}

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
    var demoFile = new demo.DemoFile();
    demoFile.on("start", () => {
      console.log("Starting");
    });

    demoFile.on("end", () => {
      console.log("Finished. Heres the deaths of this demo:");
      // fs.writeFile("./data.json", JSON.stringify(deaths), "utf8");
      return callback();
    });

    demoFile.gameEvents.on("player_death", e => {
      let data = {};
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        //   if (
        //     victim.steam64Id == 76561198027906568 ||
        //     victim.steam64Id == 76561198171618625
        //   ) {
        //     let victimTeam =
        //       victim.teamNumber === 2 ? "Terrorist" : "Counter-Terrorist";
        //     let attackerTeam =
        //       attacker.teamNumber === 2 ? "Terrorist" : "Counter-Terrorist";
        //     let miniData = {
        //       killer: attacker.name,
        //       location: {
        //         victim: {
        //           x: victim.position.x,
        //           y: victim.position.y
        //         },
        //         killer: {
        //           x: attacker.position.x,
        //           y: attacker.position.y
        //         }
        //       }
        //     };
        //     globalData[victim.name][attackerTeam].deaths[counter] = miniData;
        //     counter++;
        //   } else if (
        //     attacker.steam64Id == 76561198027906568 ||
        //     attacker.steam64Id == 76561198171618625
        //   ) {
        //     let victimTeam =
        //       victim.teamNumber === 2 ? "Terrorist" : "Counter-Terrorist";
        //     let attackerTeam =
        //       attacker.teamNumber === 2 ? "Terrorist" : "Counter-Terrorist";
        //     let miniData = {
        //       victim: victim.name,
        //       location: {
        //         victim: {
        //           x: victim.position.x,
        //           y: victim.position.y
        //         },
        //         killer: {
        //           x: attacker.position.x,
        //           y: attacker.position.y
        //         }
        //       }
        //     };
        //
        //     globalData[attacker.name][attackerTeam].kills[counter] = miniData;
        //     counter++;
        //   }
        hasKilled(victim, attacker, 76561198027906568, 76561198171618625);
        wasKilled(victim, attacker, 76561198027906568, 76561198171618625);
      }
    });
    demoFile.parse(buffer);
  });
}

fs.readdir(dir, function(err, items) {
  let promises = [];
  for (var i = 0; i < items.length; i++) {
    promises.push(
      new Promise(function(resolve, reject) {
        parseDemofile(`./demos/${items[i]}`, resolve);
      })
    );
  }
  Promise.all(promises).then(() =>
    fs.writeFile("./data.json", JSON.stringify(globalData), "utf8")
  );
});
