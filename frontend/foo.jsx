import React, { Component } from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

class Foo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const username = "76561198027906568";

    let node = this.refs.kd;
    this.svg = d3
      .select(node)
      .append("svg")
      .attr("height", node.clientHeight)
      .attr("width", node.clientWidth);

    let margin = { top: 50, right: 20, bottom: 30, left: 50 },
      width = +this.svg.attr("width") - margin.left - margin.right,
      height = +this.svg.attr("height") - margin.top - margin.bottom;

    this.g = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    firebase
      .database()
      .ref(`/${username}/Weapons Data/ak47`)
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
          margin
        });
      });

    // window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    if (window.innerWidth < 500) {
      this.setState({ width: 450, height: 102 });
    } else {
      let update_width = window.innerWidth - 100;
      let update_height = Math.round(update_width / 4.4);
      this.setState({ width: update_width, height: update_height });
    }
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

//   componentWillUpdate(nextProps, nextState) {
//     debugger;
//   }

  createChart() {
    if (!this.state.weapon) {
      return null;
    }
    const { height, width, weapon } = this.state;
    var x = d3.scaleLinear().rangeRound([0, width]);

    var y = d3.scaleLinear().rangeRound([height, 0]);
    var line = d3
      .line()
      .x(function(d) {
        return x(d.match);
      })
      .y(function(d) {
        return y(d.accuracy);
      });
    x.domain(
      d3.extent(weapon, function(d) {
        return d.match;
      })
    );
    y.domain(
      d3.extent(weapon, function(d) {
        return parseFloat(d.accuracy);
      })
    );
    let axis = d3
      .axisLeft(y)
      .tickValues(d3.range(y.domain()[0], y.domain()[1] + 1, 1))
      .tickPadding(10)
      .tickFormat(function(d) {
        return ~~d;
      });

    let t = d3
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .on("start", function(d) {
        console.log("transiton start");
      })
      .on("end", function(d) {
        console.log("transiton end");
      });

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
      .text("Accuracy (%)");

    this.g
      .append("path")
      .datum(weapon)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line)
  }

  render() {
    return (
      <div id="weapons-chart" ref={"kd"}>
        {this.createChart()}
      </div>
    );
  }
}

export default Foo;
