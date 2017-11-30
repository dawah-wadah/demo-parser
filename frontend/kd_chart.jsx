import React from "react";
import firebase from "firebase";
import * as d3 from "d3";
import { sizes } from "lodash";

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
      .select("div#main-body")
      .append("svg")
      .attr("height", this.height)
      .attr("width", this.width);

    // firebase
    //   .database()
    //   .ref(`/${username}/de_dust2`)
    //   .once("value", snapshot => {
    //     this.extractData(snapshot.val());
    //   });

      this.extractData()
  }

  extractData(sides) {
    // let data = {
    //   CTKills: Object.keys(sides["Counter-Terrorist"].kills).length,
    //   TKills: Object.keys(sides["Terrorist"].kills).length ,
    //   CTDeaths: Object.keys(sides["Counter-Terrorist"].deaths).length,
    //   TDeaths: Object.keys(sides["Terrorist"].deaths).length
    // };
    let data = {
      CTKills: 50,
      TKills: 50,
      CTDeaths: 70,
      TDeaths: 30
    };
    this.setState({ data });
  }

  createChart(data) {
    if (!this.state.data) { return }

    const radius = Math.min(this.width, this.height) / 2;
    let color = d3.scaleOrdinal(d3.schemeCategory20b);

    let g = d3.select("svg")
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    );

    let partition = d3.partition()
      .size([2 * Math.PI, radius]);

    let root = d3.hierarchy(data)
      .sum(d => d.size);

    partition(root);

    let arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0 / 2)
      .outerRadius(d => d.y1 / 2);

    g.selectAll('path')
      .data(root.descendants())
      .enter().append('path')
      .attr("display", d => d.depth ? null : "none")
      .attr("d", arc)
      .style('stroke', '#fff')
      .style("fill", d => color((d.children ? d : d.parent).data.name));

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

  yo() {
    return this.state.data.CTKills;
  }

  render() {
    if (!this.state.data) {return null }
    const b = this.transformData();
    this.createChart(b);
    return <div>{this.yo()}</div>;
  }
}
