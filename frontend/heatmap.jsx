import React from "react";

import axios from "axios";
import h337 from "heatmap.js";
import { assign, merge, values } from "lodash";

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
      heatmapLayers: false,
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

    this.createHeatmapLayers = this.createHeatmapLayers.bind(this);
  }

  componentDidMount() {
    /* Clones heatmapConfig object */
    const heatmapConfig = { ...this.state.heatmapConfig };
    heatmapConfig.container = this.refs.heatmap;

    this.setState({ heatmapConfig }, this.createHeatmapLayers);
  }

  /* A heatmap color scheme generator */
  configColors(data) {
    const colors = {
      deaths: { ".3": "yellow", ".4": "orange", "1": "red" },
      kills: { ".3": "white", ".4": "aqua", "1": "blue" },
    };

    return colors[data];
  }

  /* Adds heatmap canvas elements to DOM and stores references in state */
  createHeatmapLayers() {
    const properties = ["deaths", "kills"];
    let heatmapConfig = assign({}, this.state.heatmapConfig);
    let heatmapLayers = {};

    properties.forEach(layer => {
      heatmapConfig.gradient = this.configColors(layer);
      heatmapLayers[layer] = h337.create(heatmapConfig);
    });

    this.setState({ heatmapLayers });
  }

  /* Iterates over each game and draws heatmap depending on a type (deats or kills) */
  applyDataToMap(type) {
    if (!this.state.heatmapConfig.container || !this.state.heatmapLayers) {
      return null;
    }

    const roles = {
      deaths: "victim",
      kills: "killer"
    };

    let role = roles[type];
    let mapData = [];

    for (let game in this.props.gameData) {
      let locationData = this.extractLocation(this.props.gameData[game][type], role)
      mapData = [...mapData, ...locationData];
    }

    this.state.heatmapLayers[type].setData({ max: 10, data: mapData });
  }

  /* Iterates over type events and returns array of coordinates */
  extractLocation(gameEvent, role) {
    let mapData = [];

    for (let e in gameEvent) {
      const { x, y } = gameEvent[e].location[role];

      let xPos = Math.floor(
        Math.abs(x - -2203) / 3764 * (840 * 4 / 10) + 64.7 * 4 / 10
      );
      let yPos = Math.floor(
        969.7 * 4 / 10 - Math.abs((y - -1031) / 4090 * (923.7 * 4 / 10))
      );

      mapData.push({ x: xPos, y: yPos, value: 10 });
    }

    return mapData;
  }

  renderMap() {
    ["deaths", "kills"].forEach(type => {
      this.applyDataToMap(type);
    });
  }

  render() {

    let iconStyle = {
      width: "50px",
      height: "50px"
    };

    return (
      <div className="heatmap-container">
        <div id="heatmap" ref="heatmap">
          {this.renderMap()}
        </div>
      </div>
    );
  }
}

export default Heatmap;
