import React from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { values } from "lodash";

export default class KDChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // this.generateArc = this.generateArc.bind(this);
  }

  componentDidMount() {
    const username = this.props.match.params.id;
    let node = this.refs.kd
    this.width = node.clientWidth
    this.height = node.clientHeight
    this.svg = d3
      .select(this.refs.kd)
      .append("svg")
      .attr("height", this.height )
      .attr("width", this.width);

    firebase
      .database()
      .ref(`/${username}/games`)
      .once("value", snapshot => {
        this.extractData(snapshot.val());
      });
  }

  generateArc(options) {
    let multiplier = options.multiplier ? options.multiplier : 1;
    let radius = options.radius
      ? options.radius
      : Math.min(this.width, this.height);
    let x = options.x ? options.x : d3.scaleLinear().range([0, 2 * Math.PI]);
    let y = options.y ? options.y : d3.scaleSqrt().range([0, radius / 2]);

    return d3
      .arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1 * multiplier)));
  }
  generateArc2(options) {
    let multiplier = options.multiplier ? options.multiplier : 1;
    let radius = options.radius
      ? options.radius
      : Math.min(this.width, this.height);
    let x = options.x ? options.x : d3.scaleLinear().range([0, 2 * Math.PI]);
    let y = options.y ? options.y : d3.scaleSqrt().range([0, radius / 2]);

    return d3
      .arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1 * multiplier)));
  }

  extractData(sides) {
    let data = {
      "Counter-Terrorist": { deaths: {}, kills: {} },
      Terrorist: { deaths: {}, kills: {} }
    };

    function insertData(team, status, weapon, value) {
      if (data[team][status][value.weapon]) {
        data[team][status][value.weapon].push(value);
      } else {
        data[team][status][value.weapon] = [];
        data[team][status][value.weapon].push(value);
      }
    }

    values(sides).forEach(game => {
      let side = "Terrorist";
      let deaths = values(game.deaths);
      let kills = values(game.kills);
      if (game.Team == "Counter-Terrorist") {
        side = "Counter-Terrorist";
      }
      if (deaths) {
        deaths.forEach(death =>
          insertData(side, "deaths", death.weapon, death)
        );
      }
      if (kills) {
        kills.forEach(kill => insertData(side, "kills", kill.weapon, kill));
      }
    });

    // let ctdeaths = sides["Counter-Terrorist"].deaths;
    // for (let team in sides) {
    //   for (let status in sides[team]) {
    //     for (let key in sides[team][status]) {
    //       insertData(team, status, key, sides[team][status][key]);
    //     }
    //   }
    // }

    debugger;

    let newData = { ctKills: {} };

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
    this.path = g
      .selectAll("path")
      .data(root.descendants())
      .enter();

    this.path
      .append("path")
      .attr("d", this.generateArc({ x, y }))
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
      // d3.selectAll("path").on("mouseover", null);
      d3.selectAll("path").on("mouseleave", null);

      let arc = this.generateArc({ x, y });
      this.path
        .transition()
        .duration(750)
        .tween("scale", () => {
          let xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius ]);
          return t => {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
          };
        })
        .selectAll("path")
        // .on("mouseleave", this.hideInfo)
        .attrTween("d", d => () => arc(d));
    }
    d3.selectAll("path").on("mouseleave", this.hideInfo.bind(this));
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
      const percentValue = (100 * d.value / d.parent.value).toPrecision(2);
      let multiplier = d.height == 0 ? 2 : 1;
      d3.select("#percentage").text(`${percentValue}% - ${d.data.name}`);

      const sequenceArray = d.ancestors().reverse();

      sequenceArray.shift();

      d3.selectAll("path").style("opacity", 0.4);

      this.svg
        .selectAll("path")
        .filter(node => sequenceArray.indexOf(node) >= 0)
        .style("opacity", 1)
        .filter(
          node => sequenceArray.indexOf(node) === sequenceArray.length - 1
        );
      // .attr("d", d => this.generateArc2({ multiplier })(d));
    }
  }

  hideInfo(d) {
    d3
      .selectAll("path")
      .transition()
      .duration(500)
      .style("opacity", 1)
      .attr("d", this.generateArc({}))
      .on("end", d => {
        d3.selectAll("path").on("mouseover", this.showInfo.bind(this));
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
