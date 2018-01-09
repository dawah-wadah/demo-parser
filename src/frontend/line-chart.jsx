import React, { Component } from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

export default class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  makeSVG() {
    let node = this.node;

    this.svg = d3
      .select(node)
      .append("svg")
      .attr("height", node.clientHeight)
      .attr("width", node.clientWidth);

    let margin = { top: 50, right: 20, bottom: 30, left: 50 };

    this.g = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  componentDidMount() {
    const { player, weaponName, col } = this.props;
    this.makeSVG();
    let margin = { top: 50, right: 50, bottom: 30, left: 50 },
      width = +this.svg.attr("width") - margin.left - margin.right,
      height = +this.svg.attr("height") - margin.top - margin.bottom;
    firebase
      .database()
      .ref(`/players/${player}/Weapons Data/${weaponName}`)
      .limitToLast(25)
      .once("value", snapshot => {
        let games = values(snapshot.val());
        let i = games.length;
        this.setState({
          weapon: games.map(game => {
            game.match = i;
            i--;
            return game;
          }),
          height,
          width,
          margin,
          weaponName,
          col
        });
      });
  }

  componentWillMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    // if (node.clientWidth < 500) {
    //   this.setState({ width: 450, height: 102 });
    // } else {
    //   let update_width = node.clientWidth;
    //   let update_height = node.clientHeight;
    //   this.setState({ width: update_width, height: update_height });
    // }
    d3
      .select(this.node)
      .selectAll("*")
      .remove();

    this.makeSVG();

    this.createChart();
  }

  createChart() {
    if (!this.state.weapon) {
      return null;
    }
    this.drawChart();
  }

  drawChart() {
    const { height, width, weapon, col } = this.state;

    let accessor;

    switch (col) {
      case "Shots Fired":
        accessor = "totalShots";
        break;
      case "Damage Dealt":
        accessor = "damageDealt";
        break;
      case "Total Hits":
        accessor = "totalHits";
        break;
      default:
        accessor = "accuracy";
        break;
    }
    var x = d3.scaleLinear().rangeRound([0, width]);

    var y = d3.scaleLinear().rangeRound([height, 0]);
    var line = d3
      .line()
      .x(function(d) {
        return x(d.match);
      })
      .y(function(d) {
        let num;
        if (accessor === "accuracy") {
          num = (d.totalHits || 0 / d.totalShots) * 100;
        } else {
          num = parseFloat(d[accessor]);
        }
        return y(num);
      });
    x.domain(
      d3.extent(weapon, function(d) {
        return d.match;
      })
    );
    y.domain(
      d3.extent(weapon, function(d) {
        if (accessor === "accuracy") {
          return (d.totalHits || 0 / d.totalShots) * 100;
        } else {
          return parseFloat(d[accessor]);
        }
      })
    );

    this.g
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#fff")
      .attr("font-size", "2em")
      .attr("transform", "rotate(-90)")
      .attr("y", 10)
      .attr("dy", "1em")
      .attr("text-anchor", "end")
      .text(col === "Weapon Name" ? "Accuracy" : col || "Accuracy");

    this.g
      .append("path")
      .datum(weapon)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    var t = this.svg
      .transition()
      .delay(150)
      .duration(500)
      .ease(d3.easeLinear);

    t.select("rect.curtain").attr("width", 0);
  }

  render() {
    return (
      <div id="weapons-chart" ref={node => (this.node = node)}>
        {this.createChart()}
      </div>
    );
  }
}
