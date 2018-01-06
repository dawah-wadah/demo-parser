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
        radius: 8,
        maxOpacity: 0.8,
        minOpacity: 0,
        blur: 0.75,
        gradient: { "0.2": "black" }
      },
      heatmapLayers: false,
      checkboxStatus: {
        kills: { "Terrorist": false, "Counter-Terrorist": false },
        deaths: { "Terrorist": false, "Counter-Terrorist": false }
      },
      checked: {
        kills: "",
        deaths: ""
      },
      sides: ["Counter-Terrorist", "Terrorist"],
      statuses: ["kills", "deaths"],
      info: false
    };

    this.createHeatmapLayers = this.createHeatmapLayers.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      kills: { ".3": "white", ".4": "aqua", "1": "blue" }
    };

    return colors[data];
  }

  createCheckBoxes(team) {
    return this.state.statuses.map(status => (
      <label className="custom-checkbox">
        <input
          checked={this.state.checkboxStatus[status][team]}
          type="checkbox"
          value={`${team} ${status}`}
          onChange={this.handleChange}
        />
      <div className={`box ${team.slice(0, 1).toLowerCase()}`}/>
      </label>
      )
    );
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

  handleChange(e) {
    const checked = e.target.checked;
    const value = e.target.value.split(" ");
    const type = value[1];
    const oppositeTeam =
      value[0] === "Counter-Terrorist" ? "Terrorist" : "Counter-Terrorist";
    let team = checked ? value[0] : "";

    /* Creates a copy of the state and performs all necessary changes */
    let stateCopy = { ...this.state };
    stateCopy.checked[type] = team;
    stateCopy.checkboxStatus[type][value[0]] = checked;
    stateCopy.checkboxStatus[type][oppositeTeam] = false;

    this.setState(stateCopy);
  }

  /* Iterates over each game and draws heatmap depending on a type (deats or kills) */
  applyDataToMap(type, team) {
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
      /* Extracts location only if the team is the same */
      if (this.props.gameData[game].Team === team) {
        let locationData = this.extractLocation(
          this.props.gameData[game][type],
          role
        );
        mapData = [...mapData, ...locationData];
      }
    }

    this.state.heatmapLayers[type].setData({ max: 10, data: mapData });
  }

  convertPositions(x, y) {
    let xPos = Math.floor(
      Math.abs(x - -2203) / 3764 * (840 * 0.6) + 64.7 * 0.6
    );
    let yPos = Math.floor(
      969.7 * 0.6 - Math.abs((y - -1031) / 4090 * (923.7 * 0.6))
    );

    return { xPos, yPos };
  }

  /* Iterates over type events and returns array of coordinates */
  extractLocation(gameEvent, role) {
    let mapData = [];

    for (let e in gameEvent) {
      let { x, y } = gameEvent[e].location[role];
      let { xPos, yPos } = this.convertPositions(x, y);
      mapData.push({ x: xPos, y: yPos, value: 10 });
    }

    return mapData;
  }

  renderMap() {
    const { checked } = this.state;

    for (let type in checked) {
      this.applyDataToMap(type, checked[type]);
    }
  }

  render() {
    return (
      <div className="heatmap-container">
        <div id="heatmap" ref="heatmap">
          {this.renderMap()}
        </div>
        <div className="heatmap-filters">
          <div className="filter-header">
            <div>T</div>
            <div>CT</div>
          </div>
          <div class="separator" />
          <div className="filter-body">
            <div className="filter-boxes">
              {this.createCheckBoxes("Terrorist")}
            </div>
            <div className="filter-stats">
              <div>Kills</div>
              <div>Deaths</div>
            </div>
            <div className="filter-boxes">
              {this.createCheckBoxes("Counter-Terrorist")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Heatmap;
