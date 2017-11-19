import h337 from "heatmap.js";
import firebase from "firebase";
import initializeFB from "./base.js";

import React from 'react';
import ReactDOM from 'react-dom';

class Heatmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      heatmapConfig: {
        container: '',
        radius: 10,
        maxOpacity: 0.8,
        minOpacity: 0,
        blur: 0.75,
        gradient: {"0.2": "black"}
      },
      heatmapData: {
        max: 10,
        data: []
      },
      heatmapLayers: {
      },
      gameData: {
        grenades: {},
        hlebopek: {},
        'Taylor Swift': {}
      }
    }

    this.fetchGrenades = this.fetchGrenades.bind(this);
  }

  componentWillMount() {
    initializeFB();
  }

  componentDidMount() {
    const heatmapConfig = {...this.state.heatmapConfig}
    heatmapConfig.container = this.refs.heatmap;
    this.setState({ heatmapConfig });
  }

  createHeatMapLayers() {

  }

  configColors(data) {
    let colors = {
      "deaths": { ".3": "yellow", ".4": "orange", "1": "red" },
      "kills": { ".3": "white", ".4": "aqua", "1": "blue" },
      "Flashbang": { ".6": "black", ".2": "floralwhite", ".3": "snow", "1": "white" },
      "High Explosive Grenade": { ".3": "wheat", ".4": "olive", "1": "seagreen" },
      "Smoke Grenade": { ".3": "dimgray", ".4": "darkgray", "1": "#303030" }
    };

    return colors[data];
  }

  fetchGrenades(e) {
    const grenade = e.target.value;

    if (!e.target.checked) { return }

    debugger;
    return firebase
      .database()
      .ref("/grenades/de_dust2/" + grenade + "/")
      .once("value")
      .then(snapshot => {
        debugger;
        this.setState({
          ...this.state, gameData: {
            ...this.state.gameData, grenades: {
              ...this.state.gameData.grenades, [grenade]: snapshot.val()
            }
          }
        });
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
      })
  }

  renderMap() {
    let debug = [
      { grenade: "Decoy", type: "deaths" },
      { grenade: "Smoke Grenade", type: "kills" },
      { grenade: "Flashbang", type: "Smoke Grenade" }
    ];

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

    if (!heatmapConfig.container) { return null }

    let mapData = [];

    for (let key in data) {
      const { x, y } = data[key];
      let xPos = Math.floor(Math.abs(x - -2203) / 3764 * 840 + 64.7);
      let yPos = Math.floor(969.7 - Math.abs((y - -1031) / 4090 * 923.7));

      mapData.push({ x: xPos, y: yPos, value: 10 });
    }

    heatmapConfig.gradient = this.configColors(type);
    debugger;
    let heatmapInstance = h337.create(heatmapConfig);
    heatmapInstance.setData({ max: 10, data: mapData });
  }

  render() {
    return (
      <div>
        <div id="heatmap" ref="heatmap">{this.renderMap()}</div>
        <button value="Flashbang" onClick={this.fetchGrenades}>Fetch</button>
        <button onClick={this.fetchCTDeaths.bind(this)}>Hlebopek CT</button>
        <input type="checkbox" value="Flashbang" onChange={this.fetchGrenades}/>
      </div>
    )
  }
}

export default Heatmap;
