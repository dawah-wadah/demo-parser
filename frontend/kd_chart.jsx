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
    if (!this.state.data) { return null; }

    const b = this.transformData();
    const radius = Math.min(this.width, this.height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    let g = d3
      .select("svg")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );

    let partition = d3.partition().size([2 * Math.PI, radius * radius / 2]);
    let root = d3.hierarchy(b).sum(d => d.size);

    partition(root);

    let colorScheme = {
      "ct": "#232964",
      "t": "#F6A509",
      "kills": "#0D5725",
      "deaths": "#B81215"
    };

    let arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => Math.sqrt(d.y0))
      .outerRadius(d => Math.sqrt(d.y1));

    this.path = g
      .selectAll("path")
      .data(root.descendants())
      .enter()

    let percents = g
      .append("text")
      .attr("id", "percentage")
      .attr("x", d => -50)
      .attr("y", d => 0)
      .style("font-size", "1em")

    this.path.append("path")
      .attr("display", d => (d.depth ? null : "none"))
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", d => {
        if (colorScheme[d.data.name]) {
          return colorScheme[d.data.name];
        } else {
          return color(d.data.name);
        }
      })
      .on("mouseover", this.showInfo.bind(this));

    d3.select("g").on("mouseleave", this.hideInfo.bind(this))
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
              name: "ct",
              children: getChildren(data["Counter-Terrorist"].kills)
            },
            {
              name: "t",
              children: getChildren(data["Terrorist"].kills)
            }
          ]
        },
        {
          name: "deaths",
          children: [
            {
              name: "ct",
              children: getChildren(data["Counter-Terrorist"].deaths)
            },
            { name: "t", children: getChildren(data["Terrorist"].deaths) }
          ]
        }
      ]
    };

    return tree;
  }

  showInfo(d) {
    const percentValue = (100 * d.value / d.parent.value).toPrecision(2);
    // debugger
    d3.select("#percentage")
      .text(`${percentValue}% - ${d.data.name}`);

    const sequenceArray = d.ancestors().reverse();
    sequenceArray.shift();

    d3.selectAll("path").style("opacity", 0.4);

    this.svg
      .selectAll("path")
      .filter(node => sequenceArray.indexOf(node) >= 0)
      .style("opacity", 1);
  }

  hideInfo(d) {
    d3.selectAll("path").on("mouseover", null);

    d3.selectAll("path")
      .transition()
      .duration(500)
      .style("opacity", 1)
      .on("end", (d) => {
        // debugger
        return d3.selectAll("path").on("mouseover", this.showInfo.bind(this)) })
  }

  render() {
    return (
      <div id="kd-chart" ref={"kd"}>
        {this.createChart()}

      </div>
    );
  }
}
