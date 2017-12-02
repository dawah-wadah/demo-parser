import React from "react";
import firebase from "firebase";
import * as d3 from "d3";

export default class KDChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.width = window.innerWidth;;
    this.height = window.innerHeight;;
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
    let data = {
      CTKills: Object.keys(sides["Counter-Terrorist"].kills).length,
      TKills: Object.keys(sides["Terrorist"].kills).length ,
      CTDeaths: Object.keys(sides["Counter-Terrorist"].deaths).length,
      TDeaths: Object.keys(sides["Terrorist"].deaths).length
    };

    let newData = {
      ctKills: {}
    }
    // let data = {
    //   CTKills: 50,
    //   TKills: 50,
    //   CTDeaths: 70,
    //   TDeaths: 30
    // };
    this.setState({ data });
  }

  createChart() {
    if (!this.state.data) { return null; }

    const b = this.transformData()

    const radius = Math.min(this.width, this.height) / 2;
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let g = d3.select("svg")
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );

    let partition = d3.partition()
      .size([2 * Math.PI, radius]);

    let root = d3.hierarchy(b)
      .sum(d => d.size);

    partition(root);

    let arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0 / 2)
      .outerRadius(d => d.y1 / 2);

    let path = g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr("display", d => d.depth ? null : "none")
      .attr("d", arc)
      .style('stroke', '#fff')
      .style("fill", d => {
        // debugger
        return (color((d.children ? d : d.parent).data.name))})
      // .on("mouseover", this.showInfo.bind(this));;

      // console.log(path.datum().value)
  }

  transformData() {
    if (!this.state.data) {
      return;
    }

    const { data } = this.state;
    let tree = {
      "name": "CSGO",
      "children": [
        {
          "name": "kills",
          "children": [
            { "name": "ct", "size": data["CTKills"] },
            { "name": "t", "size": data["TKills"] }
          ]
        },
        {
          "name": "deaths",
          "children": [
            { "name": "ct", "size": data["CTDeaths"] },
            { "name": "t", "size": data["TDeaths"] }
          ]
        }
      ]
    };

    return tree;
  }

  showInfo(d) {
    // const totalSize = selectAll('path')
    //   .data(root.descendants())
    //   .datum()
    //   .value
    const percentage = (100 * d.size / totalSize).toPrecision(3);

    d3.select("#percentage")
      .text("YOYYOYOOY");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift();

    d3.selectAll("path")
      .style("opacity", 0.3);

    this.svg.selectAll("path")
    .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
      .style("opacity", 1);
  }

  render() {
    return (
      <div id="kd-chart" ref={"kd"}>
        {this.createChart()}
        <div id="percentage"></div>
      </div>
    );
  }
}
