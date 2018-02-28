import React from "react";
import * as d3 from "d3";
import { values } from "lodash";

import StatsBar from "../player-page/stats-bar";

export default class KDChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  componentDidMount() {
    const username = this.props.id;
    let node = this.refs.kd;

    this.width = node.clientWidth;
    this.height = node.clientHeight;
    this.svg = d3
      .select(this.refs.kd)
      .append("svg")
      .attr("class", "dachart")
      .attr("height", this.height)
      .attr("width", this.width);

    this.extractData(this.props.games);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (values(this.state).length > 0) {
      return false;
    }

    return true;
  }

  generateArc(options) {
    // let multiplier = options.multiplier ? options.multiplier : 1;

    let radius = options.radius
      ? options.radius
      : Math.min(this.width, this.height);
    let x = options.x ? options.x : d3.scaleLinear().range([0, 2 * Math.PI]);
    let y = options.y ? options.y : d3.scaleSqrt().range([0, radius]);

    return d3
      .arc()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));
  }

  extractData(sides) {
    let data = {
      "Counter-Terrorist": { deaths: {}, kills: {} },
      "Terrorist": { deaths: {}, kills: {} }
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

      if (game.Team === "Counter-Terrorist") {
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
    this.setState({ data });
  }

  createChart() {
    if (!this.state.data) {
      return null;
    }

    const parsedData = this.transformData();
    const radius = Math.min(this.width, this.height) / 2;
    const color = d3.scaleOrdinal(d3.schemeCategory20);
    const colorScheme = {
      "Counter-Terrorist": "#0E9CC0",
      "Terrorist": "#F8AD33",
      "kills": "#5BB25F",
      "deaths": "#FF4243"
    };

    const x = d3.scaleLinear().range([0, 2 * Math.PI]);
    const y = d3.scaleSqrt().range([0, radius]);
    this.g = this.svg
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

    this.path = this.g
      .selectAll("path")
      .data(root.descendants())
      .enter()

    this.path
      .append("path")
      .attr("d", this.generateArc({ x, y }))
      .style("stroke", "#fff")
      .style(
        "fill",
        d => {
          if (d.depth === 0) return "#a7cbff";
          return colorScheme[d.data.name]
            ? colorScheme[d.data.name]
            : color(d.data.name)
      })
      .on("mouseover", this.showInfo.bind(this))
      .on("mouseleave", this.hideInfo.bind(this))
      .on("click", click.bind(this));

    function click(d) {
      // d3.selectAll("path").on("mouseover", null);
      // d3.selectAll("path").on("mouseleave", null);

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
        .attrTween("d", d => () => arc(d));
    }
    // d3.selectAll("path").on("mouseleave", this.hideInfo.bind(this));
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

  generateText(node) {
    if (node.depth === 1) {
      let nodeName = node.data.name;
      return nodeName.charAt(0).toUpperCase() + nodeName.slice(1);
    } else if (node.depth === 2) {
      return this.generateText(node.parent) + " as " + node.data.name;
    } else {
      return this.generateText(node.parent) + " by " + node.data.name.toUpperCase();
    }
  }

  showInfo(d) {
    if (d.parent) {
      const percentValue = (100 * d.value / d.parent.value).toPrecision(2);
      const text = `${percentValue}% ${this.generateText(d)}`;
      // let multiplier = d.height == 0 ? 2 : 1;

      d3.select("#percentage").text(`${text}`);
      d3.select("#insights").style("visibility", "visible");

      const sequenceArray = d.ancestors().reverse();
      sequenceArray.shift();

      d3.selectAll("path").style("opacity", 0.4);

      this.g
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
    d3.select("#insights").style("visibility", "hidden");
  }

  render() {
    return (
      <div className="wrapper">
        <StatsBar games={Object.values(this.props.games)} />
        <div className="chart-info">
          <div className="diagram-icon" />
          <p>Kill/Death Ratio Diagram</p>
        </div>
        <div id="insights">Insights: <span id="percentage"></span></div>
        <div id="kd-chart" ref={"kd"}>
          {this.createChart()}
        </div>
      </div>
    );
  }
}
