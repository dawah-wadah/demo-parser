import React from "react";
import h337 from "heatmap.js";
import firebase from "firebase";
import { assign, keys, values } from "lodash";

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
      heatmapLayers: {},
      checkboxStatus: {
        kills: { Terrorist: false, "Counter-Terrorist": false },
        deaths: { Terrorist: false, "Counter-Terrorist": false }
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
    heatmapConfig.gradient = { ".3": "yellow", ".4": "orange", "1": "red" };
    let heatmapLayers = {};
    heatmapLayers = h337.create(heatmapConfig);
    let data;
    firebase
      .database()
      .ref("/games/-L2N3i8C1evIoWTRKYdi/")
      .once("value", snap => {
        // game location data
        data = values(snap.val().ticks);
      })
      .then(() => {
        this.setState({ heatmapConfig, data, heatmapLayers }, this.createHeatmapLayers);
      });
  }

  /* A heatmap color scheme generator */
  configColors(data) {
    const colors = {
      deaths: { ".3": "yellow", ".4": "orange", "1": "red" },
      kills: { ".3": "white", ".4": "aqua", "1": "blue" }
    };

    return colors[data];
  }

  removeTen() {
    let { data } = this.state;
    data.splice(0, 10);
  }

  /* Adds heatmap canvas elements to DOM and stores references in state */
  createHeatmapLayers() {
    const properties = ["deaths", "kills"];
    let heatmapConfig = assign({}, this.state.heatmapConfig);
    let heatmapLayers = {};

    heatmapConfig.gradient = { ".3": "yellow", ".4": "orange", "1": "red" };
    heatmapLayers = h337.create(heatmapConfig);

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
    if (!this.state.data) {
      return null;
    }

    let { data } = this.state;

    setInterval(() => {
      // let role = roles[type];
      let mapData = [];

      let tick = data.shift();
        values(tick.position.players).forEach(loc => {
          mapData.push(this.extractLocation2(loc));
        });


      this.state.heatmapLayers.setData({ max: 5, data: mapData });
    }, 100);
  }

  extractLocation2(location) {
    //  You can get the map origin from the original CSGO folder, in the
    let mapOrigin = {
      x: -2476,
      y: 3239
    };
    let topLeft = {
      x: -2093.968,
      y: 3117.968
    };

    // number of pixels from the top left corner of screen to, the top most playable area position
    let offset = {
      x: 87,
      y: 27
    };

    // ratio of in-game units to pixel
    let ratio = offset.x / (topLeft.x - mapOrigin.x);
    let scale = 0.6;

    const { x, y } = location;
    let xPos = Math.floor((x - mapOrigin.x) * ratio * scale);
    let yPos = Math.floor((mapOrigin.y - y) * ratio * scale);

    return { x: xPos, y: yPos, value: 10 };
  }

  renderMap() {
    this.applyDataToMap();
  }

  render() {
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
