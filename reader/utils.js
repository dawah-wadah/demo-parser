exports.whereHit = num => {
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
      return "torso";
      break;
  }
};

exports.grenades = () => [
  "hegrenade",
  "flashbang",
  "smokegrenade",
  "molotov",
  "decoy"
];

exports.newWeapon = () => ({
  totalShots: 0,
  totalHits: 0,
  headShots: 0,
  damageDealt: 0,
  hitGroups: {
    head: 0,
    torso: 0,
    "left-arm": 0,
    "right-arm": 0,
    "left-leg": 0,
    "right-leg": 0
  }
});

exports.getGrenadeName = grenade => {
  switch (grenade) {
    case "hegrenade":
      return "High Explosive Grenade";
    case "flashbang":
      return "Flashbang";
    case "smokegrenade":
      return "Smoke Grenade";
    case "molotov":
      return "Molotov";
    case "decoy":
      return "Decoy";
    default:
      return "Decoy";
  }
};

exports.iterates = (obj,key, amt) => {
  if (obj[key]) {
    obj[key] += amt || 1;
  } else {
    obj[key] = amt || 1;
  }
};
