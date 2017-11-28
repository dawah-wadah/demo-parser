import React from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.diameter = 900;
    this.svg;
    this.received;
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  getShit(args) {
    let data = {};
    Object.keys(args).forEach(weapon => {
      let weaponData = { fired: 0, hits: 0, headshots: 0 };
      Object.keys(args[weapon]).forEach(key => {
        weaponData.fired += args[weapon][key].totalShots;
        weaponData.hits += args[weapon][key].totalHits;
        weaponData.headshots += args[weapon][key].headshots;
      });
      data[weapon] = weaponData;
    });
    this.setState(data);
  }

  componentDidMount() {
    let container = d3.select("div#main-body").append("svg");

    this.svg = container;

    firebase
      .database()
      .ref("/Taylor Swift/Weapons Data")
      .once("value", snapshot => {
        this.getShit(snapshot.val());
        this.received = true;
      });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.state !== nextState;
  // }

  processData(state) {
    var newDataSet = [];
    for (let weapon in state) {
      // itereate thru data here
      if (Object.prototype.hasOwnProperty.call(this.state, weapon)) {
        newDataSet.push({
          name: weapon,
          className: weapon.toLowerCase(),
          fired: state[weapon].fired,
          headshots: state[weapon].headshots,
          hits: state[weapon].hits
        });
      }
    }
    // return { children: newDataSet };
    return newDataSet;
  }

  makeChart(data) {
    let circles;
    let simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(this.diameter / 2).strength(0.05))
      .force("y", d3.forceY(this.diameter / 2).strength(0.05))
      .force("collide", d3.forceCollide(d => scaleRadius(d.fired) + 1));

    function ticked() {
      circles.attr("cx", d => d.x).attr("cy", d => d.y);
    }
    let scaleRadius = d3
      .scaleLinear()
      .domain([
        d3.min(data, function(d) {
          return +d.fired;
        }),
        d3.max(data, function(d) {
          return +d.fired;
        })
      ])
      .range([40, 150]);

    var colorCircles = d3.scaleOrdinal(d3.schemeCategory20);
    if (this.svg) {
      let shit = this.svg
        .attr("height", this.diameter)
        .attr("width", this.diameter)
        .append("g")
        .attr(
          "transform",
          "translate(" + this.diameter / 2 + "," + this.diameter / 2 + ")"
        );

      var arc = d3
        .arc()
        .innerRadius(90)
        .outerRadius(100)
        .startAngle(0)
        .endAngle(d => 2 * Math.PI * (d.hits / d.fired));

      data.forEach(weapon => {
        shit
          .data(data[weapon])
          .append("path")
          .attr("d", arc);
      });
    }
  }

  render() {
    let data = this.processData(this.state);
    this.makeChart(data);
    return <h1>Wadah is Retarded</h1>;
  }
}
