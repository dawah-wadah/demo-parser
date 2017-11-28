import React from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.diameter = 900;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.svg;
    this.received;
    this.tooltip = this.tooltip.bind(this);
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

  tooltip(svg) {
    svg
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
  }

  makeChart(data) {
    let circles;
    let arcs;
    let text;
    let simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(0).strength(0.15))
      .force("y", d3.forceY(0).strength(0.15))
      .force("collide", d3.forceCollide(d => scaleRadius(d.fired) + 5));

    function ticked() {
      arcs.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      text.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      circles.attr("cx", d => d.x).attr("cy", d => d.y);
    }
    function moveArcs() {
      arcs.attr("transform");
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
      .range([40, 130]);

    var colorCircles = d3.scaleOrdinal(d3.schemeCategory20);

    function arcTween(transition, newAngle) {
      transition.attrTween("d", function(d) {
        let accuracy = isNaN(d.hits / d.fired * 2 * Math.PI)
          ? 0
          : d.hits / (d.fired + 1) * 360 * Math.PI / 180;
        var interpolate = d3.interpolate(0, accuracy);

        return function(t) {
          d.endAngle = interpolate(t);

          return drawArc(d);
        };
      });
    }

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
    if (this.svg) {
      let svg = this.svg
        .attr("height", this.height)
        .attr("width", this.width)
        .append("g")
        .attr(
          "transform",
          "translate(" + this.width / 2 + "," + this.height / 2 + ")"
        );

      var tooltip = this.tooltip(this.svg);

      var drawArc = d3
        .arc()
        .innerRadius(d => scaleRadius(d.fired) - (scaleRadius(d.fired) / 100 * 20))
        .outerRadius(d => scaleRadius(d.fired))
        .startAngle(0);

      let nodes = svg
        .selectAll("weapons")
        .data(data)
        .enter()
        .append("g")
        .attr("width", d => scaleRadius(d.fired))
        .attr("height", d => scaleRadius(d.fired));

      circles = nodes
        .append("circle")
        .style("fill", "rgba(124,240,10,0.0)")
        .style("stroke", d => colorCircles(d.name))
        .style("stroke-width", 1)
        .attr("class", d => d.name)
        .attr("r", d => scaleRadius(d.fired))
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      arcs = nodes
        .append("path")
        .attr("fill", d => colorCircles(d.name))
        .attr("class", "arc")
        .each(function(d) {
          d.endAngle = 0;
        })
        .attr("d", drawArc);

      text = nodes
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", function(d) {
          return Math.max(d.fired / 20, 15) + "px";
        })
        .attr("dy", ".35em")
        .text(function(d) {
          return d.name;
        });

        // background = nodes
        //   .attr("background", )

      arcs
        .transition()
        .duration(750)
        .delay(300)
        .call(arcTween, this);

      simulation.nodes(data).on("tick", ticked);
    }
  }

  render() {
    let data = this.processData(this.state);
    this.makeChart(data);
    return <h1>Wadah is Retarded</h1>;
  }
}
