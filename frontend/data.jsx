import React from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.diameter = 900;
    this.svg;
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
    this.svg = d3.select("div#main-body")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);
    // debugger
    firebase
      .database()
      .ref("/Taylor Swift/Weapons Data")
      .once("value", snapshot => {
        this.getShit(snapshot.val());
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
    // debugger;
    let circles;
    let simulation = d3
      .forceSimulation()
      .force("forceX", d3.forceX().strength(0.1).x(this.width / 2))
      .force("forceY", d3.forceY().strength(0.1).y(this.height / 2))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force('charge', d3.forceManyBody().strength(-15))
      // .force("collide", d3.forceCollide().strength(.5).radius(d => scaleRadius(d.fired) + 2.5))

    function ticked() {
      // debugger;
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
      .range([35, 120]);

    const colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
    if (this.svg) {
      let dataElement = this.svg.selectAll("g").data(data);

      let elementEnter = dataElement.enter()
        .append("g")
        .attr("transform", d => `translate(-${this.width / 8}, -${this.height / 8})`);

        // .attr("height", this.diameter)
        // .attr("width", this.diameter)
        // .append("g")
        // .attr(
        //   `transform",
        //   "translate(${this.width / 2}, ${this.height / 2})`
        // );

      const tooltip = this.svg
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("color", "white")
        .style("padding", "8px")
        .style("background-color", "#626D71")
        .style("border-radius", "6px")
        .style("text-align", "center")
        .style("font-family", "monospace")
        .style("width", "400px")
        .text("");
        debugger
      // circles = this.svg
      //   .selectAll(".weapons")
      //   .data(data)
      //   .enter()
      //   .append("circle")
      //   .attr("class", d => d.name)
      //   .attr("r", d => scaleRadius(d.fired))
      //   .style("fill", d => colorCircles(d.name))
      //   .on("mouseover", function(d) {
      //     tooltip.html(d.hits + "<br>" + d.name + "<br>" + d.fired);
      //     return tooltip.style("visibility", "visible");
      //   })
      //   .on("mousemove", function() {
      //     return tooltip
      //       .style("top", d3.event.pageY - 10 + "px")
      //       .style("left", d3.event.pageX + 10 + "px");
      //   })
      //   .on("mouseout", function() {
      //     return tooltip.style("visibility", "hidden");
      //   })
      circles = elementEnter.append('circle')
        .attr("r", d => scaleRadius(d.fired))
        .style("fill", d => colorCircles(d.name))
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

      function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
      }

      function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
      }

      function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
      }

      data = data.sort((a, b) => b.fired - a.fired);

      simulation.nodes(data)
      .force("collide", d3.forceCollide().strength(.5).radius(d => scaleRadius(d.fired) + 2.5).iterations(1))
      .on("tick", ticked);
    }
  }

  render() {
    let data = this.processData(this.state);
    this.makeChart(data);
    // let chart = this.buildChart();
    // d3
    //   .select("main-body")
    //   .data(data)
    //   .call(chart);

    return <h1>Wadah is Retarded</h1>;
  }
}
