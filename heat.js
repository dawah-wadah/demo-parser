import React from "react";
import ReactDOM from "react-dom";

import { assign, merge } from "lodash";
import firebase from "firebase";
import h337 from "heatmap.js";
import initializeFB from "./base.js";

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
        grenades: {},
        hlebopek: {},
        "Taylor Swift": {}
      }
    };

    this.fetchGrenades = this.fetchGrenades.bind(this);
  }

  componentWillMount() {
    initializeFB();
  }

  componentDidMount() {
    const heatmapConfig = { ...this.state.heatmapConfig };
    heatmapConfig.container = this.refs.heatmap;
    this.setState({ heatmapConfig }, this.createHeatmapLayers.bind(this));
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
          currentData.grenades[grenade] = checked ? snapshot.val() : {}
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
        })
      });
  }

  fetchCTDeaths() {
    firebase
      .database()
      .ref("/hlebopek/de_dust2/Counter-Terrorist/deaths")
      // .orderByChild('deaths')
      .limitToFirst(5)
      .once("value", snap => {
        console.log(snap.val());
      });
  }

  renderMap() {
    const { grenades } = this.state.gameData;

    for (let type in grenades) {
      debugger;
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
    debugger;
    this.state.heatmapLayers[type].setData({ max: 10, data: mapData });
  }

  render() {
    return (
      <div>
        <div id="heatmap" ref="heatmap">
          {this.renderMap()}
        </div>
        <button value="Flashbang" onClick={this.fetchGrenades}>
          Fetch
        </button>
        <button onClick={this.fetchCTDeaths.bind(this)}>Hlebopek CT</button>
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
