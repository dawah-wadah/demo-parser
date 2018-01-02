const storeShots = (playerName, weaponsData) => {
  let promises = [];

  Object.keys(weaponsData).forEach(weapon => {
    let data = {
      totalShots: weaponsData[weapon].shots_fired,
      headshots: weaponsData[weapon].headshots,
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