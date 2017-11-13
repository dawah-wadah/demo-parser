const fs = require("fs");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");

let deaths = {};
let counter = 1;

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
        if (victim.steam64Id == 76561198027906568 || victim.steam64Id == 76561198171618625) {
          data = {
            victim: victim.name,
            killer: attacker.name,
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

          deaths[counter] = data;
          counter++;
        }
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
  Promise.all(promises).then(
    () => fs.writeFile("./data.json", JSON.stringify(deaths), "utf8")
  );
});
