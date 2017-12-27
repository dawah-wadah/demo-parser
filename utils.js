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
