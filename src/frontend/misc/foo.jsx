import React, { Component } from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

class Foo extends Component {
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

    let margin = { top: 50, right: 20, bottom: 30, left: 50 },
      width = +this.svg.attr("width") - margin.left - margin.right,
      height = +this.svg.attr("height") - margin.top - margin.bottom;

    this.g = this.svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }

  componentDidMount() {
    const { player, weaponName, col } = this.props;
    this.makeSVG();
    let margin = { top: 50, right: 20, bottom: 30, left: 50 },
      width = +this.svg.attr("width") - margin.left - margin.right,
      height = +this.svg.attr("height") - margin.top - margin.bottom;

    firebase
      .database()
      .ref(`/${player}/Weapons Data/${weaponName}`)
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
    let node = this.node;
    ;

    if (node.clientWidth < 500) {
      this.setState({ width: 450, height: 102 });
    } else {
      let update_width = node.clientWidth;
      let update_height = node.clientHeight;
      this.setState({ width: update_width, height: update_height });
    }
    d3
      .select(this.node)
      .selectAll("*")
      .remove();

    this.makeSVG();

    this.createChart();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      let node = this.node;
      ;

      if (node.clientWidth < 500) {
        this.setState({ width: 450, height: 102 });
      } else {
        let update_width = node.clientWidth;
        let update_height = node.clientHeight;
        this.setState({
          width: update_width,
          height: update_height
        });
      }
      d3
        .select(this.node)
        .selectAll("*")
        .remove();

      this.makeSVG();

      this.createChart();
    }
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
        accessor = "damage_dealt";
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
        return y(d[accessor]);
      });
    x.domain(
      d3.extent(weapon, function(d) {
        return d.match;
      })
    );
    y.domain(
      d3.extent(weapon, function(d) {
        return parseFloat(d[accessor]);
      })
    );
    let axis = d3
      .axisLeft(y)
      .tickValues(d3.range(y.domain()[0], y.domain()[1] + 1, 1))
      .tickPadding(10)
      .tickFormat(function(d) {
        return ~~d;
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
      .text(col == "Weapon Name" ? "Accuracy" : col || "Accuracy");

    this.g
      .append("path")
      .datum(weapon)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // var curtain = this.svg
    //   .append("rect")
    //   .attr("x", -1 * width * 2)
    //   .attr("y", -1 * height * 2)
    //   .attr("height", height * 2)
    //   .attr("width", width * 2)
    //   .attr("class", "curtain")
    //   .attr("transform", "rotate(180)")
    //   .style("fill", "#1d3244");
    // var guideline = this.svg
    //   .append("line")
    //   .attr("stroke", "#333")
    //   .attr("stroke-width", 0)
    //   .attr("class", "guide")
    //   .attr("x1", 1)
    //   .attr("y1", 1)
    //   .attr("x2", 1)
    //   .attr("y2", height);

    // var t = this.svg
    //   .transition()
    //   .delay(150)
    //   .duration(500)
    //   .ease(d3.easeLinear);

    // t.select("rect.curtain").attr("width", 0);
  }

  render() {
    if (!this.state.weapon) {
      return null;
    }
    const { weapon, col } = this.state;

    let accessor;

    switch (col) {
      case "Shots Fired":
        accessor = "totalShots";
        break;
      case "Damage Dealt":
        accessor = "damage_dealt";
        break;
      case "Total Hits":
        accessor = "totalHits";
        break;
      default:
        accessor = "accuracy";
        break;
    }
    chartSeries = [
      {
        field: accessor,
        name: col,
        color: "#ff7f0e"
      }
    ];

    var width = 500,
      height = 300,
      margins = { left: 100, right: 100, top: 50, bottom: 50 };

    let data = weapon.map(game => game[accessor]);
    ;
    return (
      <div id="weapons-chart" ref={node => (this.node = node)}>
          <LineChart
            margins={margin}
            data={data}
            width={width}
            height={height}
            chartSeries={chartSeries}
          />
      </div>
    );
  }
}
{
  /* <LineChart showXGrid={false} showYGrid={false} margins={margins} title={title} data={chartData} width={width} height={height} chartSeries={chartSeries} x={x} /> */
}

export default Foo;
