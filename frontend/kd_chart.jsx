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
    // debugger

    firebase
      .database()
      .ref(`/${username}/de_dust2`)
      .once("value", snapshot => {
        this.extractData(snapshot.val());
      });
  }

  extractData(sides) {
    // let data = {
    //   CTKills: Object.keys(sides["Counter-Terrorist"].kills).length,
    //   TKills: Object.keys(sides["Terrorist"].kills).length ,
    //   CTDeaths: Object.keys(sides["Counter-Terrorist"].deaths).length,
    //   TDeaths: Object.keys(sides["Terrorist"].deaths).length
    // };
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
      // if (data[team][status].count) {
      //   data[team][status].count++
      //
      // } else {
      //   data[team][status].count = 1;
      // }

      if (data[team][status][value.weapon]) {
        data[team][status][value.weapon].push(value);
      } else {
        data[team][status][value.weapon] = [];
        data[team][status][value.weapon].push(value);
      }
    }

    let ctdeaths = sides["Counter-Terrorist"].deaths;
    // let CTDeaths = []
    for (let team in sides) {
      for (let status in sides[team]) {
        for (let key in sides[team][status]) {
          insertData(sides, team, status, key, sides[team][status][key]);
        }
      }
    }
    // debugger
    // debugger

    let newData = {
      ctKills: {}
    };
    // let data = {
    //   CTKills: 50,
    //   TKills: 50,
    //   CTDeaths: 70,
    //   TDeaths: 30
    // };
    this.setState({ data });
  }

  createChart() {
    if (!this.state.data) {
      return null;
    }

    const b = this.transformData();

    const radius = Math.min(this.width, this.height) / 2;
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let g = d3
      .select("svg")
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );

    let partition = d3.partition().size([2 * Math.PI, radius]);

    let root = d3.hierarchy(b).sum(d => d.size);

    partition(root);

    let colorScheme = {
      "ct": "#202C46",
      "t": "#F6A509"
    };

    let arc = d3
      .arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0 / 2)
      .outerRadius(d => d.y1 / 2);

    let path = g
      .selectAll("path")
      .data(root.descendants())
      .enter()
      .append("path")
      .attr("display", d => (d.depth ? null : "none"))
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", d => {
        if (colorScheme[d.data.name]) {
          debugger
          return colorScheme[d.data.name];
        } else {
          return color(d.data.name);
        }
      });
    // .on("mouseover", this.showInfo.bind(this));;

    // console.log(path.datum().value)
  }

  transformData() {
    if (!this.state.data) {
      return;
    }

    const { data } = this.state;

    function getChildren(parent) {
      // debugger
      let children = [];
      // parent.forEach(thing => {
      for (let weapon in parent) {
        children.push({
          name: weapon,
          size: parent[weapon].length
        });
      }
      // })
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
    console.log(tree);
    return tree;
  }

  showInfo(d) {
    // const totalSize = selectAll('path')
    //   .data(root.descendants())
    //   .datum()
    //   .value
    const percentage = (100 * d.size / totalSize).toPrecision(3);

    d3.select("#percentage").text("YOYYOYOOY");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift();

    d3.selectAll("path").style("opacity", 0.3);

    this.svg
      .selectAll("path")
      .filter(function(node) {
        return sequenceArray.indexOf(node) >= 0;
      })
      .style("opacity", 1);
  }

  render() {
    return (
      <div id="kd-chart" ref={"kd"}>
        {this.createChart()}
        <div id="percentage" />
      </div>
    );
  }
}
