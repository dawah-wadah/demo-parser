const fs = require("fs");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");
const ProgressBar = require("ascii-progress");

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

function storeData(attacker, victim, status) {
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
    globalData.kills[attacker.name].dust_2[attacker.side][status][
      counter
    ] = killData;
  } else {
    globalData.kills[victim.name].dust_2[victim.side][status][
      counter
    ] = killData;
  }
  counter++;
}

function hasKilled(victim, attacker, ...playerID) {
  playerID.forEach(id => {
    if (attacker.steam64Id == id) {
      // console.log("%s killed %s", attacker.name, victim.name);
      storeData(attacker, victim, "kills");
    }
  });
}
function wasKilled(victim, attacker, ...playerID) {
  playerID.forEach(id => {
    if (victim.steam64Id == id) {
      // console.log("%s was killed by %s", victim.name, attacker.name);
      storeData(attacker, victim, "deaths");
    }
  });
}
function storeGrenadeData(evt) {
  if (globalData.grenades.dust_2[evt.name] === undefined) {
    globalData.grenades.dust_2[evt.name] = {};
  }
  let location = { x: evt.x, y: evt.y };
  globalData.grenades.dust_2[evt.name][counter] = location;
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

function parseDemofile(file, callback) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);
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
      bar.total = demoFile.header.playbackTicks;
      console.log("Loaded " + file);
    });

    demoFile.on("end", () => {
      updateProgress(bar, demoFile);
      return callback();
    });

    let grenades = [
      "hegrenade",
      "flashbang",
      "smokegrenade",
      "molotov",
      "decoy"
    ];

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
        updateProgress(bar, demoFile);
      });
    });

    demoFile.gameEvents.on("player_death", e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        hasKilled(victim, attacker, 76561198027906568, 76561198171618625);
        wasKilled(victim, attacker, 76561198027906568, 76561198171618625);
      }
      updateProgress(bar, demoFile);
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
