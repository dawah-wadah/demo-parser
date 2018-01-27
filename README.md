# Counter-Stats: GO

![CS-Stats-Logo](public/assets/readme/cs-stats-logo.png)

### [Counter-Stats: GO Live Link][firebase]
[firebase]: https://cs-go-33263.firebaseapp.com

Counter-Stats: GO is a web application that serves as a stat tracker for Counter-Strike: GO players. It incorporates `Node.js`, `React.js`, `D3.js` and Google's own `Firebase` (Cloud Database, Cloud Functions and Firestore).

## Synopsis
**Counter-Strike: GO** is a multiplayer first-person shooter video game. The majority of players always look to become better in order to outperform their opponents. Therefore, lots of player record their games (`demos`) and then spend many hours rewatching these demos in search of bad decisions and mistakes.

Being avid CS:GO players and enthusiastic software developers we've decide to create an application that would just grab the data from demos and display it in a clean and interactive way.

## How it works
We created a functionality that parses CS:GO demo files (extension is `.dem`) and listens to a number of game events. For example, every time someone shoots a gun or deals damage to the opponent, demo-parser will dive in and extract game data such as player's name, location, weapon of choice and many more.

The collected data is stored inside JSON object that is shipped to NoSQL Firebase cloud database. From there it is delivered to the client-side where it's used to generate interactive charts, diagrams and panels.

## Features

### Parsing of CS:GO DEM files
A DEM file is a game replay file that is used to record a player's perspective in the game.

We've created a `parseDemo` function that iterates over demo files and extracts in-game data. The function is located in Firebase's `Cloud Functions` and is connected to local `Cloud Firestore`. Every time when demo is uploaded to the storage, Firebase will trigger a `parseDemo` function which will result in fetching new data and adding new records to database.

### Cloud database
Counter-Stats utilizes Firebase, a cloud-hosted realtime database. Data is stored as one large JSON tree and synchronized in realtime to every connected client.

Below is an example of how data is structured and stored in database.

**Games records** holds basic info about each game: name of the map and players' ids.

```
{
  "games": {
    "-L2QgK_cci7V0J4Ir9xq": {
      "Map": "de_dust2",
      "players": {
        "1": 76561197966251440,
        "2": 76561198164039211
      }
    }
  }
}
```
**Players records** is the massive one. It stores everything you need to know about each player: games played, results, weapon usage data and many more. Here's a short sample:

```
{
  "players": {
    "76561197960386362": {
      "games": {
        "L2QhZtsY9LsnPbzcH8i": {
          "a": 4,
          "d": 9,
          "k": 7,
          "map": "de_dust2",
          "team": "Counter-Terrorist",
          "win": false,
          "kills": {
            "-L2Qht_OI52nUfcK_per": {
              "killer": "Repent",
              "killerID": 76561197960386362,
              "victim": "Cruzito",
              "victimID": 76561198422965540,
              "location": {
                "killer": {
                  "x": 384.6308288574219,
                  "y": 2202.019287109375
                },
                "victim": {...}
              }
            }
          }
        }
      },
      "weaponsData": {
        "m4a1": {
          "-L2QhZtsY9LsnPbzcH8i": {
              "damageDealt": 581,
              "totalHits": 19,
              "totalShots": 99,
              "headShots": 1,
              "hitGroups": {
                "head": 1,
                "left-arm": 1,
                "left-leg": 1,
                "right-arm": 2,
                "right-leg": 1,
                "torso": 13
              }
            }
          }
        }
      }
    }
  }
}
```

### Mainpage
Mainpage lists top 15 players based on the amount of matches they played.

There's a search bar on top of the page that supports a live search and displays the result as user types.

```  
filterPlayers() {
    const { players } = this.state;

    return pickBy(players, (value, key) => {
      if (!value.steamInfo) return;
      const playerName = value.steamInfo.name.toLowerCase();
      const searchName = this.state.playerName.toLowerCase();

      return startsWith(playerName, searchName);
    });
  }
  ```

![filter](/public/assets/readme/filter.gif)

### Player's page
Player's page features player's info and general stats as well as a links to other specific stats: [Overview](#overview), [Weapons](#weapons) and [Heatmap](#heatmap).

### KD Chart
Player's page also displays Kill/Death Ratio Diagram, a zoomable sunburst chart built with `D3.js`. User can inspect player's KD stats for each team as well as weapons that had been used in each case.

Clicking on any chart's arc will create a zoom-in effect while clicking on a center circle will reverse it back to previous layer.

![KD-chart](/public/assets/readme/KD.gif)

### Overview
Overview consists of three panels: `Favorite map`, `Recent game`, `Favorite weapon`. It's a sneak peek on some of the player's match data.

![overview](/public/assets/readme/Overview.gif)

### Weapons
Weapons tab is the best resource for learning more about player's weapon preferences and skills. All data is stored in a table where each row is assigned to a specific weapon. Weapons table consists of 5 columns: `Weapon's name`, `Shots Fired`, `Damage Dealt`, `Total Hits` and `Accuracy Bar`.

Clicking on any of these columns will reveal a `linear chart`. Charts use the value of the column and match it to the amount of games played in order to generate an accurate graph.

Each weapon in Counter-Strike has its own unique spray pattern and recoil compensation. Players are aware of this aspect of the game and work on mastering these patterns. Clicking on accuracy bar will reveal an extra chart with character body parts. It uses in-game data and distributes it accordingly throughout the body parts. Players might find this chart extremely helpful as it tells players how they should correct their spraying skills for each weapon.

![weapons](/public/assets/readme/Weapons.gif)
