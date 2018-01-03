import React from "react";
import ReactDOM from "react-dom";
// import * as APIKeys from "../keys.json";
import axios from "axios";

import { assign, merge, values } from "lodash";
import firebase from "firebase";
import h337 from "heatmap.js";

// import Row from "./tableRow.jsx";

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
      statuses: ["kills", "deaths"],
      info: false
    };

    this.fetchGrenades = this.fetchGrenades.bind(this);
    this.fetchPlayerData = this.fetchPlayerData.bind(this);
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
        // players = Object.keys(snap.val()).filter(
        //   dataType => dataType !== "grenades" && dataType !== "logs"
        // );
        players = snap.val();
      })
      .then(resp => this.setState({ players }));
  }

  createButtons() {
    const { players, info } = this.state;

    if (players.length) {
      return null;
    }
    let buttons = [];
    buttons = values(players).map(player => (
      <Row player={player} callback={this.fetchPlayerData.bind(this)} />
    ));

    return buttons;
  }

  createCheckBoxes() {
    const grenades = Object.keys(this.state.heatmapLayers).slice(2);

    return grenades.map((gr, i) => (
      <label key={i}>
        {" "}
        {gr} <input type="checkbox" value={gr} onChange={this.fetchGrenades} />{" "}
      </label>
    ));
  }

  fetchPlayerData(e) {
    const checked = e.target.checked;
    const endPoint = e.target.value.split(" ");
    const player = endPoint.slice(0, -2).join(" ");
    const status = endPoint[endPoint.length - 1];
    const side = endPoint[endPoint.length - 2];

    if (!checked) {
      this.setState({
        ...this.state,
        gameData: {
          ...this.state.gameData,
          [status]: {}
        }
      });
      return;
    }

    firebase
      .database()
      .ref(`/${player}/de_dust2/${side}/${status}`)
      .once("value")
      .then(snapshot =>
        this.setState({
          ...this.state,
          gameData: {
            ...this.state.gameData,
            [status]: snapshot.val()
          }
        })
      );
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
    let currentData = assign({}, this.state.gameData);
    const checked = e.target.checked;

    if (!checked) {
      currentData.grenades[grenade] = {};
      this.setState({ gameData: currentData });
      return;
    }

    firebase
      .database()
      .ref("/grenades/de_dust2/" + grenade + "/")
      .once("value")
      .then(snapshot => {
        currentData.grenades[grenade] = snapshot.val();
        this.setState({
          gameData: currentData
        });
      });
  }

  renderMap() {
    const { grenades } = this.state.gameData;

    for (let type in grenades) {
      this.showOnMap(grenades[type], type);
    }

    for (let type in this.state.gameData) {
      if (type !== "grenades") {
        this.showOnMap(this.state.gameData[type], type);
      }
    }
  }

  showOnMap(data, type) {
    const { heatmapConfig } = this.state;

    if (!heatmapConfig.container) {
      return null;
    }

    let destination = type === "deaths" ? "victim" : "killer";
    let mapData = [];

    for (let key in data) {
      const { x, y } = data[key].location
        ? data[key].location[destination]
        : data[key];

      let xPos = Math.floor(
        Math.abs(x - -2203) / 3764 * (840 * 4 / 10) + 64.7 * 4 / 10
      );
      let yPos = Math.floor(
        969.7 * 4 / 10 - Math.abs((y - -1031) / 4090 * (923.7 * 4 / 10))
      );

      mapData.push({ x: xPos, y: yPos, value: 10 });
    }

    this.state.heatmapLayers[type].setData({ max: 10, data: mapData });
  }

  convertPositions(x, y) {
    let xPos = Math.floor(
      Math.abs(x - -2203) / 3764 * (840 * 4 / 10) + 64.7 * 4 / 10
    );
    let yPos = Math.floor(
      969.7 * 4 / 10 - Math.abs((y - -1031) / 4090 * (923.7 * 4 / 10))
    );
    return { xPos, yPos };
  }

  render() {
    let iconStyle = {
      width: "50px",
      height: "50px"
    };
    return (
      <div className="heatmap-container">
        <div id="heatmap" ref="heatmap">
          {" "}
          {this.renderMap()}{" "}
        </div>{" "}
        <div className="list">
          <div className="table-row" id="table-header">
            <div className="user-info">
              <div className="profile-image" style={iconStyle}>
                Player Icon
              </div>
              <div className="vert-line" />
              <div className="profile-image" style={iconStyle}>
                Player Name
              </div>
            </div>
            <div className="checkboxes">
              <div className="profile-image" style={iconStyle}>
                CT Kill
              </div>
              <div className="vert-line" />
              <div className="profile-image" style={iconStyle}>
                CT Death
              </div>
              <div className="vert-line" />
              <div className="profile-image" style={iconStyle}>
                T Kills
              </div>
              <div className="vert-line" />
              <div className="profile-image" style={iconStyle}>
                T Death
              </div>
            </div>
          </div>
          {this.createButtons()} {this.createCheckBoxes()}{" "}
        </div>
      </div>
    );
  }
}

export default Heatmap;
