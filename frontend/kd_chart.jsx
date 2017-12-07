import React from "react";
import firebase from "firebase";
import * as d3 from "d3";

export default class KDChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  componentDidMount() {
    const username = this.props.match.params.id;
    this.svg = d3
      .select(this.refs.kd)
      .append("svg")
      .attr("height", this.height)
      .attr("width", this.width);

    firebase
      .database()
      .ref(`/${username}/de_dust2`)
      .once("value", snapshot => {
        this.extractData(snapshot.val());
      });
  }

  extractData(sides) {
    let data = {
      "Counter-Terrorist": {
        deaths: {},
        kills: {}
      },
      Terrorist: {
        deaths: {},
        kills: {}
      }
    };

    function insertData(sides, team, status, weapon, value) {
      if (data[team][status][value.weapon]) {
        data[team][status][value.weapon].push(value);
      } else {
        data[team][status][value.weapon] = [];
        data[team][status][value.weapon].push(value);
      }
    }

    let ctdeaths = sides["Counter-Terrorist"].deaths;
    for (let team in sides) {
      for (let status in sides[team]) {
        for (let key in sides[team][status]) {
          insertData(sides, team, status, key, sides[team][status][key]);
        }
      }
    }

    let newData = {
      ctKills: {}
    };

    this.setState({ data });
  }

  createChart() {
    if (!this.state.data) {
      return null;
    }

    const parsedData = this.transformData();
    const radius = Math.min(this.width, this.height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleLinear().range([0, 2 * Math.PI]);
    const y = d3.scaleSqrt().range([0, radius / 2]);
    let g = d3
      .select("svg")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );

    let partition = d3.partition();
    let root = d3
      .hierarchy(parsedData)
      .sum(d => d.size)
      .sort((a, b) => a.value - b.value);

    partition(root);

    let colorScheme = {
      "Counter-Terrorist": "#232964",
      Terrorist: "#F6A509",
      kills: "#0D5725",
      deaths: "#B81215"
    };

    let arc = d3
      .arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    this.path = g
      .selectAll("path")
      .data(root.descendants())
      .enter();

    this.path
      .append("path")
      .attr("d", arc)
      .style("stroke", "#fff")
      .style(
        "fill",
        d =>
          colorScheme[d.data.name]
            ? colorScheme[d.data.name]
            : color(d.data.name)
      )
      .on("mouseover", this.showInfo.bind(this))
      .on("click", click.bind(this));
    let percents = this.path
      .append("text")
      .attr("id", "percentage")
      .attr("x", d => -50)
      .attr("y", d => 0)
      .style("font-size", "3em");

    function click(d) {
      this.path
        .transition()
        .duration(750)
        .tween("scale", () => {
          let xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius / 2]);
          return t => {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
          };
        })
        .selectAll("path")
        .attrTween("d", d => () => arc(d));
    }
    d3.select("g").on("mouseleave", this.hideInfo.bind(this));
  }

  transformData() {
    if (!this.state.data) {
      return;
    }

    const { data } = this.state;

    function getChildren(parent) {
      let children = [];

      for (let weapon in parent) {
        children.push({
          name: weapon,
          size: parent[weapon].length
        });
      }

      return children;
    }

    let tree = {
      name: "CSGO",
      children: [
        {
          name: "kills",
          children: [
            {
              name: "Counter-Terrorist",
              children: getChildren(data["Counter-Terrorist"].kills)
            },
            {
              name: "Terrorist",
              children: getChildren(data["Terrorist"].kills)
            }
          ]
        },
        {
          name: "deaths",
          children: [
            {
              name: "Counter-Terrorist",
              children: getChildren(data["Counter-Terrorist"].deaths)
            },
            {
              name: "Terrorist",
              children: getChildren(data["Terrorist"].deaths)
            }
          ]
        }
      ]
    };

    return tree;
  }

  showInfo(d) {
    if (d.parent) {
      const radius = Math.min(this.width, this.height) / 2;
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const x = d3.scaleLinear().range([0, 2 * Math.PI]);
      const y = d3.scaleSqrt().range([0, radius / 2]);

      let arc = d3
        .arc()
        .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
        .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
        .innerRadius(d => Math.max(0, y(d.y0)))
        .outerRadius(d => Math.max(0, y(d.y1 * 2)));

      let percentValue = (100 * d.value / d.parent.value).toPrecision(2);

      d3.select("#percentage").text(`${percentValue}% - ${d.data.name}`);

      const sequenceArray = d.ancestors().reverse();
      sequenceArray.shift();

      d3.selectAll("path").style("opacity", 0.4);

      this.svg
        .selectAll("path")
        .filter(node => sequenceArray.indexOf(node) >= 0)
        .style("opacity", 1)
        .filter(node => sequenceArray.reverse().indexOf(node) === 0)
        .attr("d", arc);
    }
  }

  hideInfo(d) {
    d3.selectAll("path").on("mouseover", null);
    // debugger

    const radius = Math.min(this.width, this.height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const x = d3.scaleLinear().range([0, 2 * Math.PI]);
    const y = d3.scaleSqrt().range([0, radius / 2]);

    let arc = d3
      .arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    d3
      .selectAll("path")
      .transition()
      .duration(300)
      .style("opacity", 1)
      .attr("d", arc)
      .on("end", d => {
        return d3.selectAll("path").on("mouseover", this.showInfo.bind(this));
      });
  }

  render() {
    return (
      <div id="kd-chart" ref={"kd"}>
        {this.createChart()}
      </div>
    );
  }
}
