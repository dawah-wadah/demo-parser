import React from "react";
import ReactDOM from "react-dom";

import { assign, merge } from "lodash";
import firebase from "firebase";
import h337 from "heatmap.js";

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      heatmapConfig: {
        container: "",
        radius: 10,
        maxOpacity: 0.8,
        minOpacity: 0,
        blur: 0.75,
        gradient: { "0.2": "black" }
      },
      heatmapLayers: {
        kills: {},
        deaths: {},
        Flashbang: {},
        "High Explosive Grenade": {},
        "Smoke Grenade": {}
      },
      gameData: {
        grenades: {}
      },
      buttons: [],
      keys: {},
      players: [],
      sides: ["Counter-Terrorist", "Terrorist"],
      statuses: ["kills", "deaths"]
    };

    this.fetchGrenades = this.fetchGrenades.bind(this);
    this.fetchDaShiznit = this.fetchDaShiznit.bind(this);
  }

  componentWillMount() {}

  componentDidMount() {
    let players;
    const heatmapConfig = { ...this.state.heatmapConfig };
    heatmapConfig.container = this.refs.heatmap;
    this.setState({ heatmapConfig }, this.createHeatmapLayers.bind(this));

    firebase
      .database()
      .ref("/")
      .once("value", snap => {
        players = Object.keys(snap.val()).filter(
          dataType => dataType !== "grenades"
        );
      })
      .then(resp => this.setState({ buttons: this.createButtons(players) }));
  }

  createButtons(players) {
    let buttons = [];
    let id = 1;

    players.forEach(player => {
      this.state.sides.forEach(side => {
        this.state.statuses.forEach(status => {
          const buttonName = `${player} ${status} as ${side}`;
          const button = (
            <button key={id++} value={`${player} ${side} ${status}`} onClick={e => console.log(e.target.value)}>
              {buttonName}
            </button>
          );
          buttons.push(button);
        });
      });
    });

    return buttons;
  }

  fetchPlayerData(e) {
    const endPoint = e.target.value.split(" ");

    firebase
      .database()
      .ref(`/${endPoint[0]}/de_dust2/${endPoint[1]}/${endPoint[2]}`)
      .once("value", snap => (snapshot.val()))
      .then(resp => this.setState({ gameData[status]: {}}));
  }

  getData() {
    let players = ["hlebopek", "Taylor Swift"];
    let teams = ["Counter-Terrorist", "Terrorist"];
    let statuses = ["kills", "deaths"];

    players.forEach(player => {
      teams.forEach(team => {
        statuses.forEach(status => {
          let options = { player, team, status };
          this.fetchDaShiznit(options);
        });
      });
    });
  }

  createHeatmapLayers() {
    const properties = [
      "deaths",
      "kills",
      "Flashbang",
      "High Explosive Grenade",
      "Smoke Grenade"
    ];
    let heatmapConfig = assign({}, this.state.heatmapConfig);
    let heatmapLayers = {};

    properties.forEach(layer => {
      heatmapConfig.gradient = this.configColors(layer);
      heatmapLayers[layer] = h337.create(heatmapConfig);
    });

    this.setState({ heatmapLayers });
  }

  configColors(data) {
    let colors = {
      deaths: { ".3": "yellow", ".4": "orange", "1": "red" },
      kills: { ".3": "white", ".4": "aqua", "1": "blue" },
      Flashbang: {
        ".6": "black",
        ".2": "floralwhite",
        ".3": "snow",
        "1": "white"
      },
      "High Explosive Grenade": {
        ".3": "wheat",
        ".4": "olive",
        "1": "seagreen"
      },
      "Smoke Grenade": { ".3": "dimgray", ".4": "darkgray", "1": "#303030" }
    };

    return colors[data];
  }

  fetchGrenades(e) {
    const grenade = e.target.value;
    const currentData = assign({}, this.state.gameData);
    const checked = e.target.checked;

    return firebase
      .database()
      .ref("/grenades/de_dust2/" + grenade + "/")
      .once("value")
      .then(snapshot => {
        currentData.grenades[grenade] = checked ? snapshot.val() : {};
        // this.setState({
        //   ...this.state,
        //   gameData: {
        //     ...this.state.gameData,
        //     grenades: {
        //       ...this.state.gameData.grenades,
        //       [grenade]: snapshot.val()
        //     }
        //   }
        // });
        this.setState({
          gameData: currentData
        });
      });
  }

  fetchDaShiznit(options) {
    const currentData = assign({}, this.state.gameData);
    debugger;
    firebase
      .database()
      .ref(`/${options.player}/de_dust2/${options.team}/${options.status}`)
      // .orderByChild('deaths')
      .limitToFirst(5)
      .once("value", snap => {
        // currentData[options.player][options.team][options.status] = snap.val()
        console.log(snap.val());
      });
  }

  renderButtons() {
    const { buttons } = this.state;

    if (buttons.length === 0) {
      return null;
    }

    return buttons;
  }

  renderMap() {
    const { grenades } = this.state.gameData;

    for (let type in grenades) {
      this.showOnMap(grenades[type], type);
    }
    // debug.forEach(foo => {
    //   this.fetchGrenades(foo.grenade)
    //     .then(grenades => this.showOnMap(grenades, foo.type));
    // });

    // this.showOnMap(this.state.gameData.Flashbang, "deaths");
  }

  showOnMap(data, type) {
    const { heatmapConfig } = this.state;

    if (!heatmapConfig.container) {
      return null;
    }

    let mapData = [];

    for (let key in data) {
      const { x, y } = data[key];
      let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
      let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));

      mapData.push({ x: xPos, y: yPos, value: 10 });
    }

    this.state.heatmapLayers[type].setData({ max: 10, data: mapData });
  }

  render() {
    return (
      <div>
        <div id="heatmap" ref="heatmap">
          {this.renderMap()}
        </div>
        {this.renderButtons()}
        <input
          type="checkbox"
          value="Flashbang"
          name="Flashbang"
          onChange={this.fetchGrenades}
        />
        <input
          type="checkbox"
          value="High Explosive Grenade"
          onChange={this.fetchGrenades}
        />
      </div>
    );
  }
}

export default Heatmap;
