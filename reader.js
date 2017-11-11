const fs = require("fs");
const assert = require("assert");
const path = require("path");
const dir = "./demos";
const demo = require("demofile");

function parseDemofile(file) {
  fs.readFile(file, function(err, buffer) {
    assert.ifError(err);

    var demoFile = new demo.DemoFile();
    demoFile.on("start", () => {
      console.log("Starting");
    });

    demoFile.on("end", () => {
      console.log("Finished.");
    });

    demoFile.gameEvents.on("player_death", e => {
      let victim = demoFile.entities.getByUserId(e.userid);
      let attacker = demoFile.entities.getByUserId(e.attacker);
      if (victim && attacker) {
        if (victim.steam64Id == 76561198027906568) {
          // console.log(
          //   "%s killed %s with %s (attacker has %d hp remaining)",
          //   attacker.name,
          //   victim.name,
          //   e.weapon,
          //   attacker.health
          // );
          console.log("Victim Info");
          console.log(victim.name);
          console.log(victim.position.x);
          console.log(victim.position.y);
          console.log("Killer Info");
          console.log(attacker.name);
          console.log(attacker.position.x);
          console.log(attacker.position.y);
        }
      }
    });
    demoFile.parse(buffer);
  });
}

fs.readdir(dir, function(err, items) {
  items.forEach(item => {
    console.log("Demo Name: " + item);
    parseDemofile(`./demos/${item}`);
  });
});
